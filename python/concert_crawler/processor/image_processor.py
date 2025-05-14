# ocr_processor.py
import uuid
import time
import base64
import requests
import io
from PIL import Image
import boto3
import json
import gc  # 가비지 컬렉션
from config import OCR_API_URL, OCR_SECRET_KEY, OCR_API_KEY, S3_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_REGION

class ImageProcessor:
    @staticmethod
    def process_notice_image(image_url, show_id):
        try:
            buffers = []  # 생성된 모든 버퍼 객체 추적용
            parts = []    # 생성된 모든 이미지 조각 추적용

            print(f"🖼️ 이미지 처리 시작: {image_url}")
            
            # 이미지 다운로드
            response = requests.get(image_url)
            if response.status_code != 200:
                print(f"❌ 이미지 다운로드 실패: {response.status_code}")
                return None, None
                
            image_data = response.content
            
            # 이미지 로드
            img = Image.open(io.BytesIO(image_data))
            width, height = img.size
            print(f"✅ 이미지 크기: {width}x{height} 픽셀")
            
            # RGBA 모드 처리 - RGB로 변환
            if img.mode == 'RGBA':
                print("🔄 RGBA 이미지를 RGB로 변환 중...")
                # 흰색 배경 생성
                background = Image.new('RGB', img.size, (255, 255, 255))
                # 알파 채널을 고려하여 이미지 합성
                background.paste(img, mask=img.split()[3])  # 3은 알파 채널
                img = background

            # OCR 텍스트 초기화
            full_text = ""
            
            # 이미지가 큰 경우 분할 처리
            max_height = 4000
            overlap = 200
            
            if height <= max_height:
                # 작은 이미지는 그대로 처리
                buffer = io.BytesIO()
                buffers.append(buffer)

                # img.save(buffer, format="JPEG")
                img.convert('RGB').save(buffer, format="JPEG")
                part_data = buffer.getvalue()
                part_text = ImageProcessor.extract_text_with_ocr(part_data)
                if part_text:  # None 체크
                    full_text += part_text + " "
            else:
                # 큰 이미지는 분할하여 처리
                parts_count = (height // (max_height - overlap)) + 1
                print(f"이미지를 {parts_count}개의 조각으로 분할하여 처리합니다.")
                
                for i in range(parts_count):
                    # 시작 및 종료 위치 계산
                    start_y = i * (max_height - overlap)
                    end_y = min(start_y + max_height, height)
                    
                    # 조각 이미지 생성
                    part = img.crop((0, start_y, width, end_y))
                    
                    # 메모리에 저장
                    buffer = io.BytesIO()
                    buffers.append(buffer)

                    # part.save(buffer, format="JPEG")
                    part.convert('RGB').save(buffer, format="JPEG")
                    part_data = buffer.getvalue()
                    
                    # OCR 처리
                    print(f"조각 {i+1}/{parts_count} OCR 처리 중...")
                    part_text = ImageProcessor.extract_text_with_ocr(part_data)
                    if part_text:  # None 체크
                        full_text += part_text + " "
            
            # S3 업로드 (원본 이미지)

            # RGB로 변환된 이미지를 JPEG으로 저장
            output_buffer = io.BytesIO()
            buffers.append(output_buffer)

            img.convert('RGB').save(output_buffer, format="JPEG")
            image_data_to_upload = output_buffer.getvalue()

            s3_key = f"chunks/notice_{show_id}.jpg"
            s3_url = ImageProcessor.upload_to_s3(image_data_to_upload, s3_key)
            
            print("🧹 메모리 정리 중...")
            del response, image_data

            for buf in buffers:
                buf.close()
            del buffers

            for part_img in parts:
                part_img.close()
            del parts

            img.close()
            del img

            gc.collect()
            print("✅ 메모리 정리 완료")
            
            return s3_url, full_text.strip()
            
        except Exception as e:
            print(f"❌ 이미지 처리 오류: {str(e)}")
            import traceback
            traceback.print_exc()
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

             # 디버깅: 전체 응답 출력
            print(f"OCR 응답 상태 코드: {response.status_code}")
            # print(f"OCR 응답 내용: {response.text[:500]}...") # 응답이 길 수 있으므로 앞부분만 출력
            
            if response.status_code == 200:
                result = response.json()

                 # 디버깅: 결과 구조 확인
                print(f"OCR 결과 구조: {json.dumps(result, indent=2)[:500]}...")
                
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
            import traceback
            traceback.print_exc()  # 상세 오류 정보 출력  
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