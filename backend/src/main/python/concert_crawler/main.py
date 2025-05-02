import os
from crawler.crawl_i import ConcertCrawler
from crawler.notice_image_crawler import DetailCrawler
from database.concert_db import ConcertDB
from config import TEMP_IMAGE_DIR

def main():
    # 임시 이미지 디렉토리 생성
    os.makedirs(TEMP_IMAGE_DIR, exist_ok=True)
    
    # 1단계: 기본 공연 정보 크롤링
    concert_crawler = ConcertCrawler()
    all_concerts = concert_crawler.crawl_concerts()
    
    # 2단계: 각 공연의 상세 정보 및 OCR 처리
    for concert in all_concerts:
        print(f"\n🔍 '{concert['title']}' 상세 정보 및 공지사항 추출 중...")
        
        # 상세 페이지에서 공지사항 및 날짜 정보 추출
        detail_info = DetailCrawler.get_concert_detail(concert['show_id'])
        
        if detail_info:
            concert.update(detail_info)
            print(f"✅ OCR 텍스트 추출 완료 ({len(detail_info.get('ocr_text', ''))} 자)")
            if detail_info.get('advance_reservation'):
                print(f"🗓️ 사전 예매일: {detail_info['advance_reservation']}")
            if detail_info.get('reservation'):
                print(f"🗓️ 일반 예매일: {detail_info['reservation']}")
            if detail_info.get('start_times'):
                print(f"🕒 공연 시작 시간: {', '.join(detail_info['start_times'])}")
        else:
            print("❌ 공지사항 이미지 추출 실패 또는 없음")
        
        # 3단계: 데이터베이스에 저장
        ConcertDB.save_concert(concert)
    
    # 임시 이미지 파일 정리
    print("\n🧹 임시 파일 정리 중...")
    for file in os.listdir(TEMP_IMAGE_DIR):
        if file.startswith("notice_") and file.endswith(".jpg"):
            os.remove(os.path.join(TEMP_IMAGE_DIR, file))
    
    print(f"\n🎉 크롤링 완료! 전체 {len(all_concerts)}개의 공연 정보를 처리했습니다.")

if __name__ == "__main__":
    main()