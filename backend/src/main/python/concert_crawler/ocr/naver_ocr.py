import os
import uuid
import time
import base64
import requests
from config import OCR_API_URL, OCR_SECRET_KEY, OCR_API_KEY

class NaverOCR:
    @staticmethod
    def download_image(url, save_path):
        """이미지 URL에서 이미지를 다운로드하여 저장"""
        try:
            # 저장 디렉토리 생성
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            
            response = requests.get(url)
            if response.status_code == 200:
                with open(save_path, 'wb') as f:
                    f.write(response.content)
                return True
            return False
        except Exception as e:
            print(f"이미지 다운로드 오류: {str(e)}")
            return False
    
    @staticmethod
    def extract_text(image_path):
        """네이버 클라우드 OCR API를 사용해 이미지의 텍스트 추출"""
        try:
            with open(image_path, 'rb') as f:
                file_data = f.read()
            
            request_json = {
                'images': [
                    {
                        'format': 'jpg',
                        'name': 'concert_notice',
                        'data': base64.b64encode(file_data).decode('utf-8')
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
            
            response = requests.post(OCR_API_URL, headers=headers, json=request_json)
            
            if response.status_code == 200:
                result = response.json()
                
                # OCR 결과에서 텍스트 추출 및 결합
                full_text = ""
                if 'images' in result and len(result['images']) > 0:
                    if 'fields' in result['images'][0]:
                        for field in result['images'][0]['fields']:
                            if 'inferText' in field:
                                full_text += field['inferText'] + " "
                
                return full_text.strip()
            else:
                print(f"OCR 요청 실패: {response.status_code} {response.text}")
                return None
        except Exception as e:
            print(f"OCR 처리 오류: {str(e)}")
            return None