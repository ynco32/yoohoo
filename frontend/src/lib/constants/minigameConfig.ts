// constants/gameConfig.ts
export const GAME_CONFIG = {
  QUEUE: {
    countdownDuration: 5000, // 5초
    maxReactionTime: 5000, // 5초 제한
    countdownInterval: 100, // 100ms로 정밀하게 업데이트
  },
  GRAPE: {
    countdownDuration: 3000, // 3초
    maxReactionTime: 5000, // 5초 제한
    countdownInterval: 100, // 100ms로 정밀하게 업데이트
  },
  CAPCHA: {
    countdownDuration: 3000, // 3초
    maxReactionTime: 10000, // 10초 제한
    countdownInterval: 50, // 50ms로 정밀하게 업데이트
  },
} as const;

// 게임 모드 타입 정의
export type GameMode = keyof typeof GAME_CONFIG;

// 게임별 설정 타입 추출
export type GameConfigType = (typeof GAME_CONFIG)[GameMode];
