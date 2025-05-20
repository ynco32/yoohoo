import os
import sys
import logging
import argparse
from dotenv import load_dotenv

# 모듈 임포트
from utils import setup_logging, save_json, ensure_directory_exists
from ocr_processor import parse_paragraphs, load_ocr_from_file
from embedding_manager import get_embeddings_model, setup_pinecone_vectorstore, add_documents_to_vectorstore
from rag_engine import split_documents, create_rag_chain, query_rag_system
from db_connector import get_concert_info
from gpt_grouper import group_paragraphs_with_gpt 


from pinecone import Pinecone
def check_namespace_exists(concert_id):
    """콘서트 ID에 해당하는 네임스페이스에 데이터가 있는지 확인합니다."""
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index = pc.Index("concert")
    
    namespace = f"concert_id_{concert_id}"
    
    # 네임스페이스 통계 확인
    stats = index.describe_index_stats()
    namespaces = stats.get("namespaces", {})
    
    # 네임스페이스가 존재하고 벡터가 있는지 확인
    if namespace in namespaces and namespaces[namespace].get("vector_count", 0) > 0:
        return True
    return False


# 환경 변수 로드
load_dotenv()

def main(ocr_file_path, concert_id, output_dir="./output"):
    """메인 실행 함수"""
    
    # 출력 디렉토리 확인
    ensure_directory_exists(output_dir)
    
    # 로깅 설정
    log_file = os.path.join(output_dir, f"rag_process_{concert_id}_{os.path.basename(ocr_file_path)}.log")
    setup_logging(log_file)
    
    logger = logging.getLogger(__name__)
    logger.info("콘서트 공지사항 RAG 프로세스 시작")
    logger.info(f"OCR 파일: {ocr_file_path}")
    logger.info(f"콘서트 ID: {concert_id}")
    
    try:
        logger.info(f"콘서트 ID {concert_id}에 대한 정보를 조회합니다...")
        concert_info = get_concert_info(concert_id)
        
        if not concert_info:
            error_msg = f"콘서트 정보를 찾을 수 없습니다. ID: {concert_id}"
            logger.error(error_msg)
            # 에러를 발생시켜 프로세스 중단
            raise ValueError(error_msg)
        
        logger.info(f"콘서트 정보 조회 성공: {concert_info['concert_name']}")

        embeddings = get_embeddings_model()

        namespace_exists = check_namespace_exists(concert_id) 

        vectorstore = setup_pinecone_vectorstore(embeddings, concert_info)

        if not namespace_exists: 
            logger.info(f"콘서트 ID {concert_id}의 데이터가 벡터 저장소에 없습니다. 새로 처리합니다.")

            # 1. OCR 데이터 로드
            ocr_data = load_ocr_from_file(ocr_file_path)
            
            # 2. OCR 결과 파싱
            paragraphs = parse_paragraphs(ocr_data)
            
            # 3. 중간 결과 저장
            parsed_output_path = os.path.join(output_dir, f"parsed_paragraphs_{concert_id}.json")
            save_json(paragraphs, parsed_output_path)

            # 4. GPT로 문단 그룹화 (추가된 부분)
            logger.info("GPT를 사용하여 문단을 의미적으로 그룹화합니다...")
            grouped_paragraphs = group_paragraphs_with_gpt(paragraphs)
            
            # 5. 그룹화 결과 저장 (추가된 부분)
            grouped_output_path = os.path.join(output_dir, f"grouped_paragraphs_{concert_id}.json")
            save_json(grouped_paragraphs, grouped_output_path)
            
            # 6. 문서 분할
            texts, metadatas = split_documents(grouped_paragraphs, concert_info)
            
            # 7. 벡터 저장소에 문서 추가
            add_documents_to_vectorstore(texts, metadatas, vectorstore)

            logger.info("벡터 저장소에 데이터 추가 완료!")

        else:  
            logger.info(f"콘서트 ID {concert_id}의 데이터가 이미 벡터 저장소에 존재합니다.")  
            logger.info("기존 데이터를 사용합니다.")    
        
        logger.info("RAG 체인을 생성하고 테스트 쿼리를 실행합니다...") 
        rag_chain = create_rag_chain(vectorstore)

        test_queries = [
            "이 콘서트의 공연 시작 시간은 언제인가요?",
            "입장 시 필요한 신분증은 무엇인가요?",
            "매표소 어디인가요?",
            "좌석 수는 몇 개인가요?",
            "물품 보관소 어디인가요?",
            "선예매는 언제인가요?",
            "학생증으로도 본인인증할할 수 있나요?",
            "버스 타고 가려는데 어떻게 갈 수 있나요?",
            "어디로 입장할 수 있나요?",
            "언제쯤 끝나는 건가요?"
        ]
        
        test_results = []
        for query in test_queries:
            result = query_rag_system(rag_chain, query)

            sources = []
            # if "source_documents" in result:
            #     sources = [doc.get("content", "") for doc in result.get("source_documents", [])]

            if "source_documents" in result and result["source_documents"]:
                sources = [doc.get("content", "") for doc in result["source_documents"]]

            test_results.append({
                "query": query,
                "answer": result.get("answer", "응답 없음"),
                "sources": sources
            })
            logger.info(f"테스트 질문: {query}")
            logger.info(f"답변: {result.get('answer', '응답 없음')[:500]}...")
            logger.info(f"참조 소스 개수: {len(sources)}")
        
        # 10. 테스트 결과 저장
        test_output_path = os.path.join(output_dir, f"test_results_{concert_id}.json")
        save_json(test_results, test_output_path)
        
        logger.info("RAG 프로세스가 성공적으로 완료되었습니다!")
        
    except Exception as e:
        logger.error(f"처리 중 오류 발생: {e}", exc_info=True)
        return False
    
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="콘서트 공지사항 RAG 처리")
    parser.add_argument("--ocr_file", required=True, help="OCR 결과 JSON 파일 경로")
    parser.add_argument("--concert_id", required=True, help="콘서트 고유 ID")
    parser.add_argument("--output_dir", default="./output", help="출력 파일 저장 디렉토리")
    
    args = parser.parse_args()
    
    success = main(
        ocr_file_path=args.ocr_file,
        concert_id=args.concert_id,
        output_dir=args.output_dir
    )
    
    sys.exit(0 if success else 1)


