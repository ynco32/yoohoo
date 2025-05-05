import os
import uuid
import time
import base64
import requests
from PIL import Image
import numpy as np
import io
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
    def split_image(image_path, max_height=4000, overlap=200):
        """큰 이미지를 여러 조각으로 분할"""
        try:
            # 이미지 열기
            with Image.open(image_path) as img:
                width, height = img.size
                print(f"원본 이미지 크기: {width}x{height} 픽셀")
                
                # 이미지가 충분히 작으면 분할 필요 없음
                if height <= max_height:
                    return [image_path]
                
                # 분할 수 계산
                parts_count = (height // (max_height - overlap)) + 1
                print(f"이미지를 {parts_count}개의 조각으로 분할합니다.")
                
                # 조각별 파일 경로
                base_path = os.path.splitext(image_path)[0]
                extension = os.path.splitext(image_path)[1]
                part_paths = []
                
                for i in range(parts_count):
                    # 시작 및 종료 위치 계산
                    start_y = i * (max_height - overlap)
                    end_y = min(start_y + max_height, height)
                    
                    # 조각 이미지 생성
                    part = img.crop((0, start_y, width, end_y))
                    part_path = f"{base_path}_part_{i+1}{extension}"
                    part.save(part_path)
                    part_paths.append(part_path)
                    print(f"이미지 조각 {i+1} 저장: {start_y} ~ {end_y} 픽셀")
                
                return part_paths
        except Exception as e:
            print(f"이미지 분할 오류: {str(e)}")
            return [image_path]  # 오류 발생 시 원본 이미지 경로 반환
    
    @staticmethod
    def extract_text(image_path):
        """네이버 클라우드 OCR API를 사용해 이미지의 텍스트 추출"""
        try:
            # 이미지 분할
            image_parts = NaverOCR.split_image(image_path)
            full_text = ""
            
            for part_path in image_parts:
                print(f"이미지 조각 OCR 처리 중: {part_path}")
                
                with open(part_path, 'rb') as f:
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
                    part_text = ""
                    if 'images' in result and len(result['images']) > 0:
                        if 'fields' in result['images'][0]:
                            for field in result['images'][0]['fields']:
                                if 'inferText' in field:
                                    part_text += field['inferText'] + " "
                    
                    print(f"조각 텍스트 추출 ({len(part_text)} 자)")
                    full_text += part_text + " "
                else:
                    print(f"OCR 요청 실패: {response.status_code} {response.text}")
                
                # 원본 이미지가 아닌 경우 임시 파일 삭제
                if part_path != image_path:
                    try:
                        os.remove(part_path)
                        print(f"임시 파일 삭제: {part_path}")
                    except:
                        pass
            
            return full_text.strip()
        except Exception as e:
            print(f"OCR 처리 오류: {str(e)}")
            return ""