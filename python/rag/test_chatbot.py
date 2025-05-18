# test_chatbot.py
from chatbot_service import ConcertChatbot
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_chatbot():
    """챗봇 테스트 함수"""
    # 챗봇 인스턴스 생성
    chatbot = ConcertChatbot()
    
    # 테스트할 콘서트 ID
    concert_id = 41  # 테스트용 콘서트 ID
    
    # 테스트 질문들
    test_questions = [
        "이 콘서트의 공연 시작 시간은 언제인가요?",
        "휠체어석 예매하려는데 어떻게 하면 되나요?",
        "입장 시 필요한 신분증은 무엇인가요?",
        "오늘 날씨는 어때요?",  # 콘서트와 관련 없는 질문
    ]
    
    # 각 질문에 대해 테스트
    for question in test_questions:
        print(f"\n[질문] {question}")
        
        # 질의 처리
        response = chatbot.process_query(question, concert_id)
        
        # 결과 출력
        print(f"[답변] {response['answer']}")
        
        if response["has_evidence_image"]:
            print(f"[증거 이미지] {response['evidence_image_path']}")
        else:
            print("[증거 이미지] 없음")
        
        print("-" * 50)

if __name__ == "__main__":
    test_chatbot()