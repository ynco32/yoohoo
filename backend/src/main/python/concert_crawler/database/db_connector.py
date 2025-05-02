import pymysql
from config import DB_CONFIG

class DBConnector:
    @staticmethod
    def get_connection():
        """데이터베이스 연결 반환"""
        return pymysql.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            db=DB_CONFIG['db'],
            charset=DB_CONFIG['charset']
        )
    
    @staticmethod
    def execute_query(query, params=None, fetch=False):
        """쿼리 실행 및 결과 반환"""
        conn = DBConnector.get_connection()
        result = None
        
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                if fetch:
                    result = cursor.fetchall()
                else:
                    conn.commit()
                    result = cursor.lastrowid
        except Exception as e:
            print(f"쿼리 실행 오류: {str(e)}")
            conn.rollback()
        finally:
            conn.close()
        
        return result