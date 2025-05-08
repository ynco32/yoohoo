# ocr_processor.py
import os
import uuid
import time
import base64
import requests
import io
from PIL import Image
import boto3
import gc  # 가비지 컬렉션
from config import OCR_API_URL, OCR_SECRET_KEY, OCR_API_KEY, S3_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_REGION

class ImageProcessor:
    @staticmethod
    def process_notice_image(image_url, concert_id):
        """
        공지사항 이미지를 처리하고 S3에 업로드
        
        Args:
            image_url: 공지사항 이미지 URL
            concert_id: 콘서트 ID (파일명 생성용)
            
        Returns:
            tuple: (S3 URL, OCR 텍스트)
        """
        try:
            print(f"🖼️ 이미지 처리 시작: {image_url}")
            
            # 이미지 다운로드 (메모리에만 저장)
            response = requests.get(image_url)
            if response.status_code != 200:
                print(f"❌ 이미지 다운로드 실패: {response.status_code}")
                return None, None
                
            image_data = response.content
            
            # 이미지 정보 확인 (메모리에서 처리)
            try:
                with Image.open(io.BytesIO(image_data)) as img:
                    width, height = img.size
                    print(f"✅ 이미지 크기: {width}x{height} 픽셀, {len(image_data)/1024:.2f} KB")
                    
                    # 이미지가 크면 압축 고려
                    if len(image_data) > 5 * 1024 * 1024:  # 5MB 초과
                        print("⚠️ 큰 이미지 감지, 압축 수행")
                        img_io = io.BytesIO()
                        img.save(img_io, format='JPEG', quality=85)
                        image_data = img_io.getvalue()
                        print(f"✅ 압축 후 크기: {len(image_data)/1024:.2f} KB")
            except Exception as e:
                print(f"⚠️ 이미지 메타데이터 읽기 실패: {e}")
            
            # OCR 처리
            ocr_text = ImageProcessor.extract_text_with_ocr(image_data)
            
            # S3 업로드
            s3_key = f"chunks/notice_{show_id}.jpg"
            s3_url = ImageProcessor.upload_to_s3(image_data, s3_key)
            
            # 명시적으로 메모리 해제
            del response, image_data
            gc.collect()
            
            return s3_url, ocr_text
            
        except Exception as e:
            print(f"❌ 이미지 처리 오류: {str(e)}")
            return None, None
    
    @staticmethod
    def extract_text_with_ocr(image_data):
        """
        이미지 데이터에서 OCR 추출 (메모리 내 처리)
        
        Args:
            image_data: 이미지 바이트 데이터
            
        Returns:
            str: 추출된 텍스트
        """
        try:
            # OCR API 요청 준비
            request_json = {
                'images': [
                    {
                        'format': 'jpg',
                        'name': 'concert_notice',
                        'data': base64.b64encode(image_data).decode('utf-8')
                    }
                ],
                'requestId': str(uuid.uuid4()),
                'timestamp': int(round(time.time() * 1000)),
                'version': 'V2'
            }
            
            headers = {
                'X-OCR-SECRET': OCR_SECRET_KEY,
                'Content-Type': 'application/json',
                'X-NCP-APIGW-API-KEY-ID': OCR_API_KEY
            }
            
            # OCR API 호출
            print("🔍 OCR API 호출 중...")
            response = requests.post(OCR_API_URL, headers=headers, json=request_json)
            
            if response.status_code == 200:
                result = response.json()
                
                # 텍스트 추출
                extracted_text = ""
                if 'images' in result and len(result['images']) > 0:
                    if 'fields' in result['images'][0]:
                        for field in result['images'][0]['fields']:
                            if 'inferText' in field:
                                extracted_text += field['inferText'] + " "
                
                print(f"✅ OCR 텍스트 추출 성공 ({len(extracted_text)} 자)")
                return extracted_text.strip()
            else:
                print(f"❌ OCR API 오류: {response.status_code} - {response.text}")
                return ""
        except Exception as e:
            print(f"❌ OCR 처리 오류: {str(e)}")
            return ""
    
    @staticmethod
    def upload_to_s3(file_data, s3_key):
        """
        파일 데이터를 S3에 업로드
        
        Args:
            file_data: 파일 바이트 데이터
            s3_key: S3에 저장될 경로와 파일명
            
        Returns:
            str: S3 URL
        """
        try:
            print(f"☁️ S3 업로드 중: {s3_key}")
            
            s3_client = boto3.client(
                's3',
                aws_access_key_id=AWS_ACCESS_KEY,
                aws_secret_access_key=AWS_SECRET_KEY,
                region_name=S3_REGION
            )
            
            s3_client.put_object(
                Bucket=S3_BUCKET_NAME,
                Key=s3_key,
                Body=file_data,
                ContentType='image/jpeg'
            )
            
            # S3 URL 생성
            s3_url = f"https://{S3_BUCKET_NAME}.s3.{S3_REGION}.amazonaws.com/{s3_key}"
            print(f"✅ S3 업로드 완료: {s3_url}")
            return s3_url
            
        except Exception as e:
            print(f"❌ S3 업로드 오류: {str(e)}")
            return None