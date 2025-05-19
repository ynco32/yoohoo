# test_chatbot.py
import os
import logging
from chatbot_service import ConcertChatbot

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_chatbot():
    """챗봇 기능 테스트"""
    # 테스트할 콘서트 ID 설정
    concert_id = 41  # 실제 존재하는 콘서트 ID로 변경하세요
    
    # 테스트할 질문 목록
    test_questions = [
        "이 콘서트의 공연 시간은 언제인가요?",
        "티켓팅은 언제부터 가능한가요?",
        "입장 시 필요한 신분증은 무엇인가요?"
    ]
    
    # 챗봇 인스턴스 생성
    chatbot = ConcertChatbot()
    
    # 각 질문에 대해 테스트
    for question in test_questions:
        print(f"\n----- 질문: {question} -----")
        
        # 응답 생성
        response = chatbot.process_query(question, concert_id)
        
        # 결과 확인
        print(f"답변: {response['answer']}")
        
        if response["has_evidence_image"]:
            print(f"증거 이미지 URL: {response['evidence_image_url']}")
        else:
            print("증거 이미지 없음")
        
        # 소스 문서 개수 출력
        source_count = len(response.get("source_documents", []))
        print(f"참조 문서 수: {source_count}")
        
        print("-" * 50)

if __name__ == "__main__":
    test_chatbot()