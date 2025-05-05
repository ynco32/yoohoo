# OCR API 설정
OCR_API_URL = "https://oe7fe4lwbg.apigw.ntruss.com/custom/v1/41432/d0512270cb2eb7d3b6f7d52775d9cbffe7040d7e4012480b58c6801ffcad068f/general"
OCR_SECRET_KEY = "eG9WbHd3cHhPU1JnemRQYXRtRUFEVXBnWHFSZFFPa1E="  
OCR_API_KEY = "Edx7NLBFZ7q4W1Je02zTwCWnoWPLZ1SmPcBYha7e"        

# 데이터베이스 설정
DB_CONFIG = {
    'host': 'localhost',
    'user': 'ssafy',
    'password': 'ssafy',
    'db': 'conkiri',
    'charset': 'utf8mb4'
}

# 크롤링 설정
I_BASE_URL = "http://www.playdb.co.kr/playdb/playdblist.asp"
DETAIL_URL_TEMPLATE = "http://www.playdb.co.kr/playdb/playdbdetail.asp?sReqPlayNo={}"
HEADERS = {"User-Agent": "Mozilla/5.0"}
FILTERED_VENUES = [
    "엑스코", "고양종합운동장", "인스파이어", "올림픽공원", 
    "잠실실내체육관", "올림픽홀", "핸드볼경기장",
    "상암월드컵", "고척", "KSPO",
]

# 이미지 저장 경로
TEMP_IMAGE_DIR = "temp_images"