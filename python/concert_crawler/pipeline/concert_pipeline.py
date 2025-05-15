# pipeline/concert_pipeline.py
from processor.image_processor import ImageProcessor
from processor.info_extractor import ConcertInfoExtractor
from api.concert_api import check_concert_exists

class ConcertPipeline:
    @staticmethod
    def process_concert(crawler, concert):
        """콘서트 정보 크롤링부터 API 저장까지 전체 파이프라인 처리"""
        try: 

            # 중복 확인 - 콘서트명만으로 확인
            concert_name = concert.get('title')
            
            # 중복 확인 함수 호출
            if check_concert_exists(concert_name):
                print(f"✅ 이미 처리된 콘서트입니다: {concert_name}")
                return None
            
            # 1. 상세 정보 크롤링
            detail_info = crawler.get_concert_detail(concert['show_id'], concert)

            # OCR과 웹페이지 본문 합침침
            combined_text = ""  # 
            if 'content_text' in detail_info and detail_info['content_text']:
                combined_text += "【웹페이지 본문】\n" + detail_info['content_text'] + "\n\n"
            
            
            # 2. 이미지 처리 (공통 로직)
            if 'notice_image_url' in detail_info:
                original_image_url = detail_info['notice_image_url']
                s3_url, ocr_text = ImageProcessor.process_notice_image(
                    original_image_url, 
                    concert['show_id']
                )
                print(f"🤚🤚 S3 URL: {s3_url}")
                print(f"🤚🤚 OCR Text: {ocr_text}")
                
                # 3. 텍스트 분석 (공통 로직)
                ticketing_platform = detail_info.get('ticketing_platform', 'INTERPARK')
                if ocr_text and ticketing_platform != 'MELON':
                    extracted_info = ConcertInfoExtractor.extract_info_via_gpt(ocr_text, detail_info)
                    detail_info.update(extracted_info)
                    
                detail_info['ocr_text'] = ocr_text
                detail_info['s3_url'] = s3_url
            
            # 4. 기본 정보에 상세 정보 병합
            concert.update(detail_info)
            print(f"pipline 에서 이제 보내는거: {concert}")
            
            # 5. API 저장
            from api.concert_api import save_concert_to_java_api
            save_concert_to_java_api(concert)
            
            return concert
        
        except ConnectionError as e: 
            print(f"⛔ API 연결 오류로 크롤링을 중단합니다: {str(e)}")
            raise  