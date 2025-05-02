import re

class TextProcessor:
    @staticmethod
    def extract_dates_from_text(text):
        """OCR로 추출된 텍스트에서 날짜 정보 추출"""
        # 사전 예매일 패턴
        advance_reservation_patterns = [
            r'(?:사전예매|선예매|팬클럽\s*예매|선예약|팬클럽\s*선예매)[\s:]*([0-9]{4}[./-][0-9]{1,2}[./-][0-9]{1,2}[\s]*[0-9]{1,2}[:시][0-9]{1,2}분?)',
            r'(?:사전예매|선예매|팬클럽\s*예매|선예약|팬클럽\s*선예매)[\s:]*([0-9]{4}[./-][0-9]{1,2}[./-][0-9]{1,2})'
        ]
        
        # 일반 예매일 패턴
        reservation_patterns = [
            r'(?:일반\s*예매|일반|예매)[\s:]*([0-9]{4}[./-][0-9]{1,2}[./-][0-9]{1,2}[\s]*[0-9]{1,2}[:시][0-9]{1,2}분?)',
            r'(?:일반\s*예매|일반|예매)[\s:]*([0-9]{4}[./-][0-9]{1,2}[./-][0-9]{1,2})'
        ]
        
        # 공연 시작 시간 패턴
        start_time_patterns = [
            r'(?:공연시간|일시|시작시간|공연\s*시간)[\s:]*([0-9]{1,2}[:시][0-9]{1,2}분?)',
            r'(?:공연일시|공연\s*일시)[\s:]*([0-9]{4}[./-][0-9]{1,2}[./-][0-9]{1,2}[\s]*[0-9]{1,2}[:시][0-9]{1,2}분?)',
            r'([0-9]{4}[./-][0-9]{1,2}[./-][0-9]{1,2}[\s]*[0-9]{1,2}[:시][0-9]{1,2}분?)\s*(?:공연|시작)'
        ]
        
        advance_reservation = None
        reservation = None
        start_times = []
        
        # 사전 예매일 추출
        for pattern in advance_reservation_patterns:
            matches = re.findall(pattern, text)
            if matches:
                advance_reservation = matches[0]
                break
        
        # 일반 예매일 추출
        for pattern in reservation_patterns:
            matches = re.findall(pattern, text)
            if matches:
                reservation = matches[0]
                break
        
        # 공연 시작 시간 추출
        for pattern in start_time_patterns:
            matches = re.findall(pattern, text)
            if matches:
                start_times.extend(matches)
        
        # 날짜 형식 표준화
        if advance_reservation:
            advance_reservation = TextProcessor.standardize_date(advance_reservation)
        
        if reservation:
            reservation = TextProcessor.standardize_date(reservation)
        
        if start_times:
            start_times = [TextProcessor.standardize_date(time) for time in start_times]
        
        return advance_reservation, reservation, start_times
    
    @staticmethod
    def standardize_date(date_str):
        """다양한 날짜 형식을 YYYY-MM-DD HH:MM:SS 형식으로 표준화"""
        try:
            # 다양한 포맷 처리 (연/월/일 시:분 등)
            date_str = date_str.replace('년', '.').replace('월', '.').replace('일', ' ')
            date_str = date_str.replace('시', ':').replace('분', ':00')
            
            if ':' not in date_str:
                date_str += ' 00:00:00'
            elif date_str.count(':') == 1:
                date_str += ':00'
            
            # 구분자 통일
            date_str = date_str.replace('/', '.').replace('-', '.')
            
            # YYYY.MM.DD HH:MM:SS 형식을 YYYY-MM-DD HH:MM:SS로 변환
            parts = date_str.split(' ')
            date_part = parts[0].split('.')
            time_part = parts[1] if len(parts) > 1 else '00:00:00'
            
            # 연도가 2자리인 경우 4자리로 확장
            if len(date_part[0]) == 2:
                date_part[0] = '20' + date_part[0]
            
            # 월/일이 1자리인 경우 2자리로 확장
            if len(date_part) >= 2 and len(date_part[1]) == 1:
                date_part[1] = '0' + date_part[1]
            if len(date_part) >= 3 and len(date_part[2]) == 1:
                date_part[2] = '0' + date_part[2]
            
            standardized = f"{'-'.join(date_part)} {time_part}"
            return standardized
        except Exception as e:
            print(f"날짜 표준화 오류: {str(e)}, 원본: {date_str}")
            return date_str