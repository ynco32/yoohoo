import json
import re
from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI()  # .env의 OPENAI_API_KEY 사용

class ConcertInfoExtractor:
    @staticmethod
    def extract_info_via_gpt(text: str, base_info: dict = None) -> dict:
        # 기본 정보가 있으면 프롬프트에 추가
        base_info_text = ""
        if base_info:
            base_info_text = f"""
이미 알고 있는 공연 기본 정보:
- 공연명: {base_info.get('title', '정보 없음')}
- 장소: {base_info.get('place', '정보 없음')}
- 날짜: {base_info.get('date', '정보 없음')}
- 출연: {base_info.get('artist', '정보 없음')}
- 상세페이지: {base_info.get('detail_url', '정보 없음')}
"""

        prompt = f"""
다음 텍스트에서 공연 정보를 추출해줘. 반환은 반드시 정확한 JSON 형식으로만 해줘. 아래 양식을 지켜줘:

{{
  "concert_name": "공연 이름 (모를 경우 null)",
  "venue": "공연장 (모를 경우 null)",
  "artist": "아티스트 이름 (모를 경우 null)",
  "advance_reservation": "사전 예매일(advance_reservation): "YYYY-MM-DD HH:MM:SS" 형식 (예: "2025-05-01 12:00:00", 없으면 null)",
  "reservation": "일반 예매일(reservation): "YYYY-MM-DD HH:MM:SS" 형식 (예: "2025-05-02 12:00:00", 없으면 null)",
  "start_times": 공연 시작 시간(start_times): 배열 내 각 항목이 "YYYY-MM-DD HH:MM:SS" 형식 (예: ["2025-05-15 18:00:00", "2025-05-16 18:00:00"])
}}

{base_info_text}

위 기본 정보와 아래 텍스트를 종합하여 더 정확한 정보를 추출해줘.
이미 알고 있는 정보도 포함해서 최대한 완전한 JSON을 만들어줘.
공연 정보가 명확히 없거나 추론이 불가능하면 해당 필드는 null 또는 빈 배열로 넣어줘.

중요: 반드시 유효한 JSON 형식으로 응답해야 합니다. 설명없이 JSON만 반환해주세요.
JSON 형식이 아닌 내용은 어떤 것도 포함하지 마세요.

텍스트:
{text}
        """

        try:
            # 최대 3번까지 시도
            for attempt in range(3):
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "너는 공연 정보를 추출하는 전문가야. 항상 정확한 JSON 형식으로만 응답해."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.1,  # 낮은 temperature로 더 일관된 출력
                )
                content = response.choices[0].message.content.strip()
                
                # JSON 블록 추출 시도
                json_match = re.search(r'```json\s*([\s\S]*?)\s*```', content)
                if json_match:
                    content = json_match.group(1).strip()
                
                # 시작과 끝에 있을 수 있는 불필요한 글자 제거
                content = re.sub(r'^[^{]*', '', content)
                content = re.sub(r'[^}]*$', '', content)
                
                print(f"\n========= GPT 응답 (시도 {attempt+1}) =========")
                print(content)
                
                try:
                    result = json.loads(content)
                    return result
                except json.JSONDecodeError as e:
                    print(f"❌ JSON 파싱 오류 (시도 {attempt+1}): {str(e)}")
                    if attempt == 2:  # 마지막 시도면 기본값 반환
                        return {
                            "concert_name": base_info.get('title') if base_info else None,
                            "venue": base_info.get('place') if base_info else None,
                            "artist": base_info.get('artist') if base_info and base_info.get('artist') else None,
                            "advance_reservation": None,
                            "reservation": None,
                            "start_times": []
                        }
                    
        except Exception as e:
            print(f"❌ GPT API 호출 오류: {str(e)}")
            # 오류 발생 시 기본 정보 반환
            return {
                "concert_name": base_info.get('title') if base_info else None,
                "venue": base_info.get('place') if base_info else None,
                "artist": base_info.get('artist') if base_info and base_info.get('artist') else None,
                "advance_reservation": None,
                "reservation": None,
                "start_times": []
            }