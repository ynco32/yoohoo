import os
import sys
import requests
from bs4 import BeautifulSoup
import time
import random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ai.concert_info_extractor import ConcertInfoExtractor

# concert_crawler 디렉토리 경로 추가
current_dir = os.path.dirname(os.path.abspath(__file__))  # crawler 디렉토리
parent_dir = os.path.dirname(current_dir)  # concert_crawler 디렉토리
sys.path.append(parent_dir)

# 상대 경로 import 대신 절대 경로 사용
from config import DETAIL_URL_TEMPLATE, HEADERS, TEMP_IMAGE_DIR
from ocr.naver_ocr import NaverOCR
from ocr.text_processor import TextProcessor

class DetailCrawler:
    @staticmethod
    def get_concert_detail(show_id, base_info=None):
        """공연 상세 페이지에서 예매 링크를 찾고, 해당 링크에서 공지사항 이미지 및 기타 정보 추출"""
        detail_url = DETAIL_URL_TEMPLATE.format(show_id)
        
        # 셀레니움 설정
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-blink-features=AutomationControlled')  # 자동화 감지 방지
        options.add_argument(f'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36')
        
        driver = None
        
        try:
            driver = webdriver.Chrome(options=options)
            
            # 1. 먼저 상세 페이지에서 예매 버튼 링크 찾기
            driver.get(detail_url)
            time.sleep(random.uniform(2, 3))  # 인간 행동 시뮬레이션
            
            # 예매하기 버튼 링크 찾기
            reservation_link = None
            try:
                reservation_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//img[contains(@src, 'btn_reserve.gif')]/parent::a"))
                )
                reservation_link = reservation_button.get_attribute('href')
                print(f"🎫 예매 링크 발견: {reservation_link}")
            except Exception as e:
                print(f"❌ 예매 링크를 찾을 수 없습니다: {str(e)}")
                return {}
            
            # 티켓팅 플랫폼 확인
            ticketing_platform = "INTERPARK"  # 기본값 설정
            if "interpark" in reservation_link:
                ticketing_platform = "YES24"
            elif "yes24" in reservation_link:
                ticketing_platform = "YES24"
            elif "ticket.melon" in reservation_link:
                ticketing_platform = "MELON"
            elif "coupang" in reservation_link:
                ticketing_platform = "COUPANG_PLAY"
            
            detail_info = {
                'reservation_link': reservation_link,
                'ticketing_platform': ticketing_platform
            }
            
            # 2. 예매 페이지로 이동하여 공지사항 이미지 및 정보 수집
            try:
                driver.get(reservation_link)
                time.sleep(random.uniform(4, 6))  # 페이지 로딩 시간 기다리기
                
                # HTML 저장 (디버깅용, 선택적)
                debug_folder = os.path.join(TEMP_IMAGE_DIR, "debug")
                os.makedirs(debug_folder, exist_ok=True)
                with open(f"{debug_folder}/page_{show_id}.html", "w", encoding="utf-8") as f:
                    f.write(driver.page_source)
                
                # 모든 이미지 목록 출력
                images = driver.find_elements(By.TAG_NAME, "img")
                print(f"🔍 티켓 이미지 후보 {len(images)}개 발견")
                
                ticket_images = []
                for idx, img in enumerate(images):
                    src = img.get_attribute('src')
                    if src and ('ticketimage.interpark.com' in src or '/Play/image/' in src):
                        print(f"  이미지 {idx+1}: {src}")
                        ticket_images.append((img, src))
                
                # 본문 텍스트 추출 시도
                content_text = ''
                try:
                    content_div = driver.find_element(By.CSS_SELECTOR, 'div.prdContents.detail')
                    content_text = content_div.text
                    print(f"✅ 본문 텍스트 추출 성공 ({len(content_text)} 자)")
                except:
                    print("❌ 본문 텍스트를 찾을 수 없습니다.")
                
                # OCR 처리와 텍스트 처리 부분
                ocr_text = ''
                
                # 티켓 이미지에서 OCR 추출
                if ticket_images:
                    # 이미지 선택 (가장 큰 것 또는 첫 번째 이미지)
                    selected_img_src = ticket_images[0][1]  # 기본값
                    
                    # 가능하면 이미지 크기 비교하여 가장 큰 이미지 선택
                    max_width = 0
                    for _, src in ticket_images:
                        if 'etc' in src:  # etc 폴더 내 이미지는 일반적으로 공지사항
                            selected_img_src = src
                            break
                    
                    print(f"🖼️ 공지사항 이미지 발견: {selected_img_src}")
                    
                    # 이미지 URL 정규화
                    if selected_img_src.startswith('//'):
                        img_url = f"https:{selected_img_src}"
                    elif not selected_img_src.startswith('http'):
                        img_url = f"https://ticketimage.interpark.com{selected_img_src}"
                    else:
                        img_url = selected_img_src
                    
                    # 이미지 다운로드
                    os.makedirs(TEMP_IMAGE_DIR, exist_ok=True)
                    img_filename = f"{TEMP_IMAGE_DIR}/notice_{show_id}.jpg"
                    
                    if NaverOCR.download_image(img_url, img_filename):
                        # OCR 처리
                        ocr_text = NaverOCR.extract_text(img_filename)
                        
                        if ocr_text:
                            print(f"✅ OCR 텍스트 추출 성공 ({len(ocr_text)} 자)")
                            detail_info['notice_image_url'] = img_url
                            # OCR 텍스트 저장
                            detail_info['ocr_text'] = ocr_text
                
                if ocr_text or content_text:
                    combined_text = ""
                    if ocr_text:
                        combined_text += ocr_text + " "
                        print("\n========= OCR 전체 결과 =========")
                        print(ocr_text)
                    if content_text:
                        combined_text += content_text
                        print("\n========= 본문 텍스트 =========")
                        print(content_text)
                    
                    if ocr_text or content_text:
                        combined_text = f"{ocr_text}\n{content_text}".strip()
                        


                        # GPT API를 사용하여 정보 추출
                        gpt_result = ConcertInfoExtractor.extract_info_via_gpt(combined_text, base_info)

                        # GPT가 반환한 정보 detail_info에 병합
                        if gpt_result:
                            detail_info.update(gpt_result)

                        print("\n========= GPT 추출 결과 =========")
                        for k, v in gpt_result.items():
                            print(f"{k}: {v}")
                else:
                    print("❌ 이미지와 본문 모두 찾을 수 없습니다.")
                                
                return detail_info
                
            except Exception as e:
                print(f"❌ 예매 페이지 처리 오류: {str(e)}")
                # 예매 페이지 처리 실패해도 예매 링크와 티켓팅 플랫폼은 반환
                return {
                    'reservation_link': reservation_link,
                    'ticketing_platform': ticketing_platform
                }
            
        except Exception as e:
            print(f"❌ 상세 정보 추출 오류: {str(e)}")
            return {}
        
        finally:
            if driver:
                driver.quit()