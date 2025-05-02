import os
import requests
from bs4 import BeautifulSoup
from config import DETAIL_URL_TEMPLATE, HEADERS, TEMP_IMAGE_DIR
from ocr.naver_ocr import NaverOCR
from ocr.text_processor import TextProcessor

class DetailCrawler:
    @staticmethod
    def get_concert_detail(show_id):
        """공연 상세 페이지에서 예매 링크를 찾고, 해당 링크에서 공지사항 이미지 및 기타 정보 추출"""
        detail_url = DETAIL_URL_TEMPLATE.format(show_id)
        
        try:
            # 1. 먼저 상세 페이지에서 예매 버튼 링크 찾기
            res = requests.get(detail_url, headers=HEADERS)
            soup = BeautifulSoup(res.text, "html.parser")
            
            # 예매하기 버튼 링크 찾기
            reservation_link = None
            reservation_img = soup.find('img', src=lambda s: s and 'btn_reserve.gif' in s)
            if reservation_img and reservation_img.parent and reservation_img.parent.name == 'a':
                reservation_link = reservation_img.parent.get('href')
                print(f"🎫 예매 링크 발견: {reservation_link}")
            else:
                print("❌ 예매 링크를 찾을 수 없습니다.")
                return {}
            
            # 2. 예매 페이지로 이동하여 공지사항 이미지 및 정보 수집
            try:
                res = requests.get(reservation_link, headers=HEADERS)
                booking_soup = BeautifulSoup(res.text, "html.parser")
                
                # 티켓팅 플랫폼 확인
                ticketing_platform = "인터파크"  # 기본값 설정
                if "interpark.com" in reservation_link:
                    ticketing_platform = "인터파크"
                elif "yes24.com" in reservation_link:
                    ticketing_platform = "YES24"
                elif "ticket.melon.com" in reservation_link:
                    ticketing_platform = "멜론티켓"
                elif "ticketlink.co.kr" in reservation_link:
                    ticketing_platform = "티켓링크"
                
                detail_info = {
                    'reservation_link': reservation_link,
                    'ticketing_platform': ticketing_platform
                }
                
                # 1. 인터파크 이미지 찾기 - 경로 패턴 수정
                notice_imgs = booking_soup.find_all('img', src=lambda s: s and (
                    s.startswith('//ticketimage.interpark.com') or
                    'ticketimage.interpark.com' in s or
                    '/Play/image/' in s
                ))
                
                print(f"🔍 티켓 이미지 후보 {len(notice_imgs)}개 발견")
                
                # 2. 본문 내용 추출 (prdContents detail 클래스)
                content_div = booking_soup.find('div', class_='prdContents detail')
                content_text = ''
                
                if content_div:
                    # HTML 태그 제거하고 텍스트만 추출
                    content_text = content_div.get_text(separator=' ', strip=True)
                    print(f"✅ 본문 텍스트 추출 성공 ({len(content_text)} 자)")
                else:
                    print("❌ 본문 텍스트를 찾을 수 없습니다.")
                
                # OCR 처리와 텍스트 처리 부분
                ocr_text = ''
                
                # 이미지에서 OCR 추출
                if notice_imgs:
                    # 이미지가 여러 개인 경우 가장 큰 이미지 또는 첫 번째 이미지 선택
                    largest_img = None
                    max_size = 0
                    
                    for img in notice_imgs:
                        # 크기 속성이 있으면 비교
                        try:
                            width = int(img.get('width', 0))
                            height = int(img.get('height', 0))
                            size = width * height
                            if size > max_size:
                                max_size = size
                                largest_img = img
                        except:
                            continue
                    
                    # 크기 비교가 안 되면 첫 번째 이미지 사용
                    notice_img = largest_img if largest_img else notice_imgs[0]
                    
                    img_url = notice_img['src']
                    if img_url.startswith('//'):
                        img_url = f"https:{img_url}"
                    elif not img_url.startswith('http'):
                        img_url = f"https://ticketimage.interpark.com{img_url}"
                    
                    print(f"🖼️ 공지사항 이미지 발견: {img_url}")
                    
                    # 이미지 다운로드
                    os.makedirs(TEMP_IMAGE_DIR, exist_ok=True)
                    img_filename = f"{TEMP_IMAGE_DIR}/notice_{show_id}.jpg"
                    
                    if NaverOCR.download_image(img_url, img_filename):
                        # OCR 처리
                        ocr_text = NaverOCR.extract_text(img_filename)
                        
                        if ocr_text:
                            print(f"✅ OCR 텍스트 추출 성공 ({len(ocr_text)} 자)")
                            detail_info['notice_image_url'] = img_url
                            # OCR 텍스트와 본문 텍스트 결합
                            combined_text = ocr_text + ' ' + content_text
                            # OCR 결과만 저장 (데이터베이스 변경 없음)
                            detail_info['ocr_text'] = ocr_text
                
                # 이미지가 없는 경우에도 본문 텍스트로 정보 추출 시도
                elif content_text:
                    combined_text = content_text
                else:
                    print("❌ 이미지와 본문 모두 찾을 수 없습니다.")
                    return detail_info
                
                # 병합된 텍스트로 날짜 정보 추출 (OCR + 본문)
                advance_reservation, reservation, start_times = TextProcessor.extract_dates_from_text(combined_text)
                
                if advance_reservation or reservation or start_times:
                    print("🗓️ 텍스트에서 날짜 정보 추출 성공")
                    if advance_reservation:
                        detail_info['advance_reservation'] = advance_reservation
                        print(f"🗓️ 사전 예매일: {advance_reservation}")
                    if reservation:
                        detail_info['reservation'] = reservation
                        print(f"🗓️ 일반 예매일: {reservation}")
                    if start_times:
                        detail_info['start_times'] = start_times
                        print(f"🕒 공연 시작 시간: {', '.join(start_times)}")
                
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