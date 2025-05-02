import requests
from bs4 import BeautifulSoup
import re
from config import I_BASE_URL, HEADERS, FILTERED_VENUES

class ConcertCrawler:
    def __init__(self):
        self.seen_ids = set()
        self.duplicate_pages = 0
        self.MAX_DUPLICATE_PAGES = 3
    
    def get_concerts_from_page(self, page):
        """특정 페이지에서 공연 정보 목록 추출"""
        params = {
            "sReqMainCategory": "000003",  # 콘서트 카테고리
            "Page": page
        }
        
        res = requests.get(I_BASE_URL, headers=HEADERS, params=params)
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