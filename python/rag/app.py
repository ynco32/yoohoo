# app.py (FastAPI 버전)
import os
import re
import logging
import boto3
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from chatbot_service import ConcertChatbot
from config import S3_BUCKET_NAME, S3_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="콘끼리 챗봇 API", description="콘서트 관련 질문에 답변하는 챗봇 API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영 환경에서는 구체적인 출처로 제한하세요
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 요청 모델 정의
class ChatRequest(BaseModel):
    query: str
    concert_id: int

# 응답 모델 정의
class ChatResponse(BaseModel):
    answer: str
    has_evidence_image: bool
    evidence_image_url: Optional[str] = None
    source_documents: Optional[List[Dict[str, Any]]] = None

# 챗봇 인스턴스 생성
chatbot = ConcertChatbot()

@app.post("/api/chatbot", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    콘서트 관련 질문에 답변하는 API 엔드포인트
    
    - **query**: 사용자 질문
    - **concert_id**: 콘서트 ID
    
    응답에는 텍스트 답변과 관련 이미지 URL이 포함됩니다.
    """
    try:
        # 질의 처리
        response = chatbot.process_query(request.query, request.concert_id)
        
        # S3 URL을 직접 반환 (이미지가 있는 경우)
        if response.get("has_evidence_image") and response.get("evidence_image_url"):
            # 프록시 URL을 사용하여 미리 서명된 URL 제공
            image_key = response["evidence_image_url"].split(f"https://{S3_BUCKET_NAME}.s3.{S3_REGION}.amazonaws.com/")[1]
            response["evidence_image_url"] = f"/api/images?key={image_key}"
        
        return response
    
    except Exception as e:
        logger.error(f"API 요청 처리 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"요청 처리 중 오류가 발생했습니다: {str(e)}")

@app.get("/api/images")
async def get_image(key: str):
    """
    S3에 저장된 이미지에 대한 미리 서명된 URL을 제공하는 API 엔드포인트
    
    - **key**: S3 객체 키
    """
    try:
        # 키 유효성 검사
        if not key or not key.startswith("evidence/"):
            raise HTTPException(status_code=400, detail="유효하지 않은 이미지 키입니다.")
        
        # S3 클라이언트 생성
        s3_client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=S3_REGION
        )
        
        # 미리 서명된 URL 생성 (1시간 유효)
        try:
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': S3_BUCKET_NAME, 'Key': key},
                ExpiresIn=3600  # 1시간
            )
            
            # 미리 서명된 URL 반환
            return {"url": presigned_url}
        except Exception as s3_error:
            logger.error(f"S3 URL 생성 오류: {str(s3_error)}")
            raise HTTPException(status_code=404, detail="이미지를 찾을 수 없습니다.")
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"이미지 URL 생성 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"이미지 URL 생성 중 오류가 발생했습니다: {str(e)}")

@app.get("/chatbot/health")
async def health_check():
    """서버 상태 확인용 엔드포인트"""
    return {"status": "healthy", "service": "콘끼리 챗봇 API"}

@app.get("/")
async def root():
    """API 루트 엔드포인트"""
    return {
        "message": "콘끼리 챗봇 API에 오신 것을 환영합니다!",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

# OpenAPI 문서 설정
app.title = "콘끼리 챗봇 API"
app.description = "콘서트 관련 질문에 답변하고 시각적 증거를 제공하는 AI 챗봇 API"
app.version = "1.0.0"

if __name__ == "__main__":
    import uvicorn
    # 서버 실행 설정
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    
    logger.info(f"콘끼리 챗봇 API 서버를 {host}:{port}에서 시작합니다...")
    uvicorn.run(app, host=host, port=port)