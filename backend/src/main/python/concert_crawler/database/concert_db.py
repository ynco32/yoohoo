from database.db_connector import DBConnector

class ConcertDB:
    @staticmethod
    def get_or_create_artist(artist_name, photo_url=None):
        """아티스트 조회 또는 생성 후 artist_id 반환"""
        # 기존 아티스트 조회
        query = "SELECT artist_id FROM ARTIST WHERE artist_name = %s"
        result = DBConnector.execute_query(query, (artist_name,), True)
        
        if result and result[0]:
            return result[0][0]
        
        # 새 아티스트 생성
        insert_query = "INSERT INTO ARTIST (artist_name, artist_photo_url) VALUES (%s, %s)"
        return DBConnector.execute_query(insert_query, (artist_name, photo_url))
    
    @staticmethod
    def get_or_create_arena(arena_name):
        """공연장 조회 또는 생성 후 arena_id 반환"""
        query = "SELECT arena_id FROM ARENA WHERE arena_name = %s"
        result = DBConnector.execute_query(query, (arena_name,), True)
        
        if result and result[0]:
            return result[0][0]
        
        # 새 공연장 생성
        insert_query = "INSERT INTO ARENA (arena_name) VALUES (%s)"
        return DBConnector.execute_query(insert_query, (arena_name,))
    
    @staticmethod
    def save_concert(concert_data):
        """콘서트 정보 저장"""
        try:
            # 아티스트 및 공연장 정보 저장/조회
            artist_id = None
            if concert_data.get('artist'):
                artist_id = ConcertDB.get_or_create_artist(
                    concert_data['artist'], 
                    concert_data.get('poster_url')
                )
            
            arena_id = None
            if concert_data.get('place'):
                arena_id = ConcertDB.get_or_create_arena(concert_data['place'])
            
            # 콘서트 정보 저장 (티켓팅 플랫폼 추가)
            insert_query = """
                INSERT INTO CONCERT (
                    artist_id, arena_id, concert_name, photo_url, 
                    advance_reservation, reservation, reservation_link, ticketing_platform
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            params = (
                artist_id, arena_id, concert_data['title'], concert_data.get('poster_url'),
                concert_data.get('advance_reservation'), concert_data.get('reservation'),
                concert_data.get('reservation_link'), concert_data.get('ticketing_platform', '인터파크')
            )
            
            concert_id = DBConnector.execute_query(insert_query, params)
            
            # 공연 시작 시간 저장
            if concert_data.get('notice_image_url') or concert_data.get('content_text'):
                query = """
                INSERT INTO CONCERT_NOTICE (
                    concert_id, original_url, notice_text, notice_image_url, content_text
                ) VALUES (%s, %s, %s, %s, %s)
            """
                params = (
                    concert_id, concert_data.get('detail_url'), 
                    concert_data.get('ocr_text'), concert_data.get('notice_image_url'),
                    concert_data.get('content_text')
                )
                DBConnector.execute_query(query, params)    
                print(f"✅ 데이터베이스에 저장 완료: {concert_data['title']}")
                return concert_id
                    
        except Exception as e:
            print(f"❌ 콘서트 저장 오류: {str(e)}")
            return None