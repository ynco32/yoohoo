# auto_rag_processor.py
import os
import logging
from dotenv import load_dotenv
from db_connector import get_unprocessed_concerts, mark_rag_processed
from main import main as process_single_rag  # 👈 기존 main.py의 main 함수 임포트

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """자동 RAG 처리 메인 함수"""
    logger.info("🚀 자동 RAG 처리 시작")
    
    try:
        # 1. 미처리 콘서트 목록 조회 👈
        unprocessed_concerts = get_unprocessed_concerts()
        
        if not unprocessed_concerts:
            logger.info("📭 처리할 콘서트가 없습니다.")
            return
        
        logger.info(f"📝 총 {len(unprocessed_concerts)}개의 미처리 콘서트 발견")
        
        # 2. 각 콘서트 처리 👈
        success_count = 0
        failure_count = 0
        
        for concert_info in unprocessed_concerts:
            concert_id = concert_info['concert_id']
            show_id = concert_info['show_id']
            concert_name = concert_info['concert_name']
            
            logger.info(f"🎵 처리 중: '{concert_name}' (ID: {concert_id}, Show ID: {show_id})")
            
            try:
                # 3. 기존 main.py의 main() 함수 호출 👈
                ocr_file_path = f"ocr_results/ocr_result_{show_id}.json"  # S3 키
                output_dir = "./rag_output"
                
                success = process_single_rag(ocr_file_path, concert_id, output_dir)
                
                if success:
                    # 4. 처리 완료 후 DB 업데이트 👈
                    if mark_rag_processed(concert_id):
                        logger.info(f"✅ '{concert_name}' 처리 완료!")
                        success_count += 1
                    else:
                        logger.error(f"❌ DB 업데이트 실패: {concert_name}")
                        failure_count += 1
                else:
                    logger.error(f"❌ RAG 처리 실패: {concert_name}")
                    failure_count += 1
                    
            except Exception as e:
                logger.error(f"❌ '{concert_name}' 처리 중 오류: {str(e)}")
                failure_count += 1
        
        # 5. 결과 요약 👈
        logger.info(f"🎉 처리 완료 - 성공: {success_count}개, 실패: {failure_count}개")
        
    except Exception as e:
        logger.error(f"❌ 자동 RAG 처리 중 오류 발생: {str(e)}")

if __name__ == "__main__":
    main()