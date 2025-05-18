# app.py (FastAPI 버전)
import os
import logging
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from chatbot_service import ConcertChatbot

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="콘끼리 챗봇 API", description="콘서트 관련 질문에 답변하는 챗봇 API")

# 요청 모델 정의
class ChatRequest(BaseModel):
    query: str
    concert_id: int

# 응답 모델 정의
class ChatResponse(BaseModel):
    answer: str
    has_evidence_image: bool
    evidence_image_path: Optional[str] = None
    source_documents: Optional[List[Dict[str, Any]]] = None

# 챗봇 인스턴스 생성
chatbot = ConcertChatbot()

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    콘서트 관련 질문에 답변하는 API 엔드포인트
    
    - **query**: 사용자 질문
    - **concert_id**: 콘서트 ID
    
    응답에는 텍스트 답변과 관련 이미지 정보가 포함됩니다.
    """
    try:
        # 질의 처리
        response = chatbot.process_query(request.query, request.concert_id)
        
        # 이미지 경로를 API URL로 변환
        if response.get("evidence_image_path"):
            filename = os.path.basename(response["evidence_image_path"])
            response["evidence_image_url"] = f"/api/images/{filename}"
        
        return response
    
    except Exception as e:
        logger.error(f"API 요청 처리 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"요청 처리 중 오류가 발생했습니다: {str(e)}")

@app.get("/api/images/{filename}")
async def get_image(filename: str):
    """
    크롭된 증거 이미지를 제공하는 API 엔드포인트
    
    - **filename**: 이미지 파일명
    """
    try:
        # 이미지 파일 경로
        image_path = os.path.join(chatbot.temp_dir, filename)
        
        # 파일 존재 확인
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="이미지를 찾을 수 없습니다.")
        
        # 이미지 파일 반환
        return FileResponse(image_path, media_type="image/jpeg")
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"이미지 제공 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"이미지 제공 중 오류가 발생했습니다: {str(e)}")

@app.get("/health")
async def health_check():
    """서버 상태 확인용 엔드포인트"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)