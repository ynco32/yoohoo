/**
 * 사용자 정보 타입 정의
 */
export interface UserInfo {
  /** 사용자 ID */
  userId: number;

  /** 사용자 닉네임 */
  nickname: string;

  /** 사용자 이메일 */
  email: string;

  /** 사용자 이름 */
  userName: string;

  /** 캐릭터 URL */
  characterUrl: string;

  /** 사용자 역할 */
  role: string;
}
