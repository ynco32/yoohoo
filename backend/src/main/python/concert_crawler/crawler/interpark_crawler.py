import requests
from bs4 import BeautifulSoup
import re
import time
import random
from config import INTERPARK_BASE_URL, HEADERS, FILTERED_VENUES
from config import DETAIL_URL_TEMPLATE, HEADERS, TEMP_IMAGE_DIR 
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# crawler/interpark_crawler.py
from crawler.crawler_interface import ConcertCrawlerInterface

class InterparkCrawler(ConcertCrawlerInterface):
    def __init__(self):
        # 인터파크 콘서트 목록 크롤링
        self.seen_ids = set()
        self.duplicate_pages = 0
        self.MAX_DUPLICATE_PAGES = 3
    
    def get_concerts_from_page(self, page):
        """특정 페이지에서 공연 정보 목록 추출"""
        params = {
            "sReqMainCategory": "000003",  # 콘서트 카테고리
            "Page": page
        }
        
        res = requests.get(INTERPARK_BASE_URL, headers=HEADERS, params=params)
        soup = BeautifulSoup(res.text, "html.parser")
        show_blocks = soup.select("td[width='375']")
        
        if not show_blocks:
            return [], False
        
        new_data_found = False
        concerts = []
        
        print(f"\n📄 {page}페이지 ({len(show_blocks)}개 공연)\n")
        
        for block in show_blocks:
            a_tag = block.find("a", href="#")
            title = a_tag.text.strip() if a_tag else "제목 없음"
            onclick = a_tag.get("onclick", "")
            match = re.search(r"goDetail\('(\d+)'\)", onclick)
            show_id = match.group(1) if match else None
            
            # 중복 공연은 건너뛰기
            if show_id is None or show_id in self.seen_ids:
                continue
            
            self.seen_ids.add(show_id)
            new_data_found = True
            
            text = block.get_text(separator=" ", strip=True)
            date_match = re.search(r"일시\s*:\s*([0-9.\s~]+)", text)
            place_tag = block.find("a", href=re.compile("PlacedbInfo.asp"))
            artist_tags = block.find_all("a", href=re.compile("artistdb/detail.asp"))
            artists = [a.text.strip() for a in artist_tags]
            artist_text = ", ".join(artists) if artists else "출연자 정보 없음"
            poster_td = block.find_previous_sibling("td", attrs={"width": "90"})
            poster_img = poster_td.find("img")["src"] if poster_td and poster_td.find("img") else "포스터 없음"
            
            date = date_match.group(1).strip() if date_match else "날짜 없음"
            place = place_tag.text.strip() if place_tag else "장소 없음"
            
            detail_url = f"http://www.playdb.co.kr/playdb/playdbdetail.asp?sReqPlayNo={show_id}"
            
            # 특정 공연장 필터링
            if any(keyword in place for keyword in FILTERED_VENUES):
                concert_data = {
                    'title': title,
                    'place': place,
                    'date': date,
                    'artist': artists[0] if artists else None,
                    'poster_url': poster_img if poster_img != "포스터 없음" else None,
                    'detail_url': detail_url,
                    'show_id': show_id
                }
                
                concerts.append(concert_data)
                
                print(f"🎟️ 공연명: {title}")
                print(f"📍 장소: {place}")
                print(f"🗓️ 일시: {date}")
                print(f"👤 출연: {artist_text}")
                print(f"🔗 상세페이지: {detail_url}")
                print("-" * 50)
                
        
        return concerts, new_data_found
    
    def crawl_concerts(self):
        """페이지별로 공연 정보 수집"""
        page = 1
        all_concerts = []
        
        while True:
            concerts, new_data_found = self.get_concerts_from_page(page)
            
            if not concerts:
                print(f"\n🛑 공연이 더 이상 없습니다. (페이지 {page})")
                break
            
            all_concerts.extend(concerts)
            
            # 중복된 공연만 있던 페이지가 계속 나오면 중단
            if not new_data_found:
                self.duplicate_pages += 1
                if self.duplicate_pages >= self.MAX_DUPLICATE_PAGES:
                    print("\n🛑 더 이상 새로운 공연이 없습니다. 크롤링 종료.")
                    break
            else:
                self.duplicate_pages = 0  # 새 데이터가 있었으면 초기화
            
            page += 1
        
        print(f"\n전체 {len(all_concerts)}개의 공연 정보를 추출했습니다.")
        return all_concerts
        
    def get_concert_detail(self, show_id, base_info=None):
        # 인터파크 상세 페이지 크롤링 (notice_image_crawler.py 중 인터파크 부분)
        # 이미지 URL만 추출하여 반환
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
            ticketing_platform = "INTERPARK" 
            
            detail_info = {
                'reservation_link': reservation_link,
                'ticketing_platform': ticketing_platform
            }
            
            # 2. 예매 페이지로 이동하여 공지사항 이미지 및 정보 수집
            try:
                driver.get(reservation_link)
                time.sleep(random.uniform(4, 6)) 
                
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
                
                # 공지 이미지 추출
                if ticket_images:
                    # 이미지 선택 (가장 큰 것 또는 첫 번째 이미지)
                    selected_img_src = ticket_images[0][1]  # 기본값
                    
                        # !!! 추가: 날짜 폴더 패턴 확인 (예: 250058692025/04/18/)
                    date_pattern_images = [src for _, src in ticket_images if re.search(r'\d+/\d+/\d+/', src)]
                    if date_pattern_images:
                        print(f"📅 날짜 형식 폴더의 이미지 발견: {date_pattern_images[0]}")
                        selected_img_src = date_pattern_images[0]
                    # 이전 로직: etc 폴더 확인
                    elif any('etc' in src for _, src in ticket_images):
                        etc_images = [src for _, src in ticket_images if 'etc' in src]
                        print(f"📁 etc 폴더의 이미지 발견: {etc_images[0]}")
                        selected_img_src = etc_images[0]
                    # !!! 추가: jpg 이미지 우선
                    elif any('.jpg' in src.lower() for _, src in ticket_images):
                        jpg_images = [src for _, src in ticket_images if '.jpg' in src.lower()]
                        print(f"🖼️ JPG 이미지 발견: {jpg_images[0]}")
                        selected_img_src = jpg_images[0]
                    # !!! 추가: p.gif가 아닌 이미지 선택
                    elif any('_p.gif' not in src for _, src in ticket_images):
                        non_poster_images = [src for _, src in ticket_images if '_p.gif' not in src]
                        print(f"🖼️ 일반 이미지 발견: {non_poster_images[0]}")
                        selected_img_src = non_poster_images[0]

                        #예전 공지 이미지 찾기 로직
                    # # 가능하면 이미지 크기 비교하여 가장 큰 이미지
                    # for _, src in ticket_images:
                    #     if 'etc' in src:  # etc 폴더 내 이미지
                    #         selected_img_src = src
                    #         break
                    
                    print(f"🖼️ 공지사항 이미지 발견: {selected_img_src}")
                    
                    # 이미지 URL 정규화
                    if selected_img_src:
                        if selected_img_src.startswith('//'):
                            img_url = f"https:{selected_img_src}"
                        elif not selected_img_src.startswith('http'):
                            img_url = f"https://ticketimage.interpark.com{selected_img_src}"
                        else:
                            img_url = selected_img_src
                        
                        if img_url:
                            detail_info['notice_image_url'] = img_url
                
                        return detail_info
                
                    # 최종 반환값: 
                    # detail_info = {
                    # 'reservation_link': reservation_link,
                    # 'ticketing_platform': ticketing_platform
                    # 'notice_image_url': img_url,
                    # }
                
            except Exception as e:
                print(f"❌ 예매 페이지 처리 오류: {str(e)}")
                # 예매 페이지 처리 실패해도 예매 링크와 티켓팅 플랫폼은 반환
                return detail_info
            
        except Exception as e:
            print(f"❌ 상세 정보 추출 오류: {str(e)}")
            return {}
        
        finally:
            if driver:
                driver.quit()