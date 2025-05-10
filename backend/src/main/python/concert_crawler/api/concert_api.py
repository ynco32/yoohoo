import requests
from config import API_BASE_URL

def save_concert_to_java_api(concert_data):
    """콘서트 데이터를 Java API로 전송"""
    api_url = API_BASE_URL + "/api/v1/concert"  # API 엔드포인트

    ticketing_platform = concert_data.get('ticketing_platform', 'INTERPARK')
    
    request_data = {
        "concertName": concert_data.get('concert_name'),
        "artistName": concert_data.get('artist'),
        "venueName": concert_data.get('venue'),
        "photoUrl": concert_data.get('poster_url'),
        "advanceReservation": concert_data.get('advance_reservation'),
        "reservation": concert_data.get('reservation'),
        "ticketingPlatform": ticketing_platform,
        "startTimes": concert_data.get('start_times', []),
        "noticeImageUrl": concert_data.get('notice_image_url'),
        "noticeText": concert_data.get('ocr_text')
    }
    
    try:
        response = requests.post(api_url, json=request_data)
        if response.status_code == 200:
            result = response.json()
            concert_id = result.get('data')
            print(f"✅ 콘서트 저장 성공! ID: {concert_id}")
            return True
        else:
            print(f"❌ API 호출 실패: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ API 호출 오류: {str(e)}")
        return False