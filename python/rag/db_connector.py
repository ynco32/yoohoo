import os
import logging
import mysql.connector
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logger = logging.getLogger(__name__)

# DB 접속 정보
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

def get_connection():
    """데이터베이스 연결을 생성합니다."""
    return mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT, 
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )


def get_concert_info(concert_id):
    """콘서트 ID로 콘서트 정보를 조회합니다."""
    conn = None
    cursor = None
    
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # 콘서트 기본 정보 조회 쿼리
        query = """
        SELECT c.concert_id, c.concert_name, a.arena_name, c.photo_url, 
               c.advanced_reservation, c.reservation, c.ticketing_platform
        FROM concert c
        JOIN arena a ON c.arena_id = a.arena_id
        WHERE c.concert_id = %s
        """
        
        cursor.execute(query, (concert_id,))
        concert_info = cursor.fetchone()
        
        if not concert_info:
            logger.error(f"콘서트 ID {concert_id}에 대한 정보가 데이터베이스에 존재하지 않습니다.")
            return None
        
        # 아티스트 정보 조회 쿼리
        artist_query = """
        SELECT a.artist_name
        FROM artist a
        JOIN cast ca ON a.artist_id = ca.artist_id
        WHERE ca.concert_id = %s
        """
        
        cursor.execute(artist_query, (concert_id,))
        artists = [row['artist_name'] for row in cursor.fetchall()]
        
        # 공연 시간 정보 조회 쿼리
        times_query = """
        SELECT start_time
        FROM concert_detail
        WHERE concert_id = %s
        ORDER BY start_time
        """
        
        cursor.execute(times_query, (concert_id,))
        start_times = [row['start_time'] for row in cursor.fetchall()]
        
        # 결과 병합
        concert_info['artists'] = artists
        concert_info['start_times'] = start_times
        
        logger.info(f"콘서트 ID {concert_id}에 대한 정보 조회 성공")
        return concert_info
        
    except mysql.connector.Error as e:
        logger.error(f"데이터베이스 오류: {e}")
        if e.errno == mysql.connector.errorcode.ER_ACCESS_DENIED_ERROR:
            logger.error("데이터베이스 접근 권한이 없습니다. 사용자 이름 또는 비밀번호를 확인하세요.")
        elif e.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
            logger.error("지정된 데이터베이스가 존재하지 않습니다.")
        else:
            logger.error(f"데이터베이스 쿼리 오류: {e}")
        return None
        
    except Exception as e:
        logger.error(f"DB 조회 중 예상치 못한 오류 발생: {e}")
        return None
        
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

def get_unprocessed_concerts():
    """RAG 처리되지 않은 콘서트 목록을 조회합니다."""
    conn = None
    cursor = None
    
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # RAG 미처리 콘서트 조회
        query = """
        SELECT cn.concert_id, cn.show_id, c.concert_name
        FROM concert_notice cn
        JOIN concert c ON cn.concert_id = c.concert_id
        WHERE cn.rag_processed_at IS NULL
        AND cn.show_id IS NOT NULL
        ORDER BY cn.concert_notice_id ASC
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        logger.info(f"RAG 미처리 콘서트 {len(results)}개 조회됨")
        return results
        
    except Exception as e:
        logger.error(f"미처리 콘서트 조회 중 오류: {e}")
        return []
        
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

def mark_rag_processed(concert_id):
    """콘서트의 RAG 처리 완료를 표시합니다."""
    conn = None
    cursor = None
    
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # RAG 처리 완료 시간 업데이트
        query = """
        UPDATE concert_notice 
        SET rag_processed_at = NOW()
        WHERE concert_id = %s
        """
        
        cursor.execute(query, (concert_id,))
        conn.commit()
        
        if cursor.rowcount > 0:
            logger.info(f"콘서트 ID {concert_id}의 RAG 처리 완료 표시됨")
            return True
        else:
            logger.warning(f"콘서트 ID {concert_id}에 대한 업데이트 대상이 없음")
            return False
            
    except Exception as e:
        logger.error(f"RAG 처리 완료 표시 중 오류: {e}")
        return False
        
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()