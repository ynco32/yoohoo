# pipeline/concert_pipeline.py
from processor.image_processor import ImageProcessor
from processor.info_extractor import ConcertInfoExtractor

class ConcertPipeline:
    @staticmethod
    def process_concert(crawler, concert):
        """콘서트 정보 크롤링부터 API 저장까지 전체 파이프라인 처리"""
        # 1. 상세 정보 크롤링
        detail_info = crawler.get_concert_detail(concert['show_id'], concert)
        
        # 2. 이미지 처리 (공통 로직)
        if 'notice_image_url' in detail_info:
            s3_url, ocr_text = ImageProcessor.process_notice_image(
                detail_info['notice_image_url'], 
                concert['show_id']
            )
            
            # 3. 텍스트 분석 (공통 로직)
            if ocr_text:
                extracted_info = ConcertInfoExtractor.extract_info_via_gpt(ocr_text, concert)
                detail_info.update(extracted_info)
                detail_info['ocr_text'] = ocr_text
                detail_info['notice_image_url'] = s3_url
        
        # 4. 기본 정보에 상세 정보 병합
        concert.update(detail_info)
        
        # 5. API 저장
        from api.concert_api import save_concert_to_java_api
        save_concert_to_java_api(concert)
        
        return concert