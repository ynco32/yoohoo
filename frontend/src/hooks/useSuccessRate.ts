// src/hooks/useSuccessRate.ts
import { GAME_CONFIG, GameMode } from '@/lib/constants/minigameConfig';

interface ScoreRange {
  time: number;
  rate: number;
}

// [React] 연습 모드별 설정
const PRACTICE_MODES: Record<
  GameMode,
  {
    ranges: ScoreRange[];
    correction: number;
    timeLimit: number;
  }
> = {
  QUEUE: {
    ranges: [
      { time: 30, rate: 99 }, // 최상급
      { time: 50, rate: 95 }, // 매우 빠름
      { time: 100, rate: 85 }, // 빠름
      { time: 150, rate: 70 }, // 양호
      { time: 200, rate: 55 }, // 보통
      { time: 300, rate: 35 }, // 느림
      { time: 400, rate: 20 }, // 매우 느림
    ],
    correction: 0.7,
    timeLimit: GAME_CONFIG.QUEUE.maxReactionTime, // 5000ms
  },
  GRAPE: {
    ranges: [
      { time: 300, rate: 99 },
      { time: 500, rate: 95 },
      { time: 800, rate: 85 },
      { time: 1000, rate: 70 },
      { time: 1300, rate: 55 },
      { time: 1600, rate: 35 },
      { time: 2000, rate: 20 },
    ],
    correction: 0.9,
    timeLimit: GAME_CONFIG.GRAPE.maxReactionTime, // 5000ms
  },
  CAPCHA: {
    ranges: [
      { time: 2000, rate: 99 },
      { time: 3000, rate: 95 },
      { time: 4000, rate: 85 },
      { time: 6000, rate: 70 },
      { time: 8000, rate: 55 },
      { time: 9000, rate: 35 },
      { time: 10000, rate: 20 },
    ],
    correction: 0.8,
    timeLimit: GAME_CONFIG.CAPCHA.maxReactionTime, // 10000ms
  },
};

// [React] 성공률 계산 커스텀 훅
export const useSuccessRate = (mode: GameMode) => {
  const calculateSuccessRate = (reactionTime: number): number => {
    // mode가 undefined이거나 존재하지 않는 경우 처리
    if (!mode || !PRACTICE_MODES[mode]) {
      console.error(`Invalid mode: ${mode}`);
      return 5; // 기본값 반환
    }

    const { ranges, correction, timeLimit } = PRACTICE_MODES[mode];

    // 시간 초과 체크
    if (reactionTime >= timeLimit) {
      return 5; // 시간 초과시 5% 성공률
    }

    const sortedRanges = [...ranges].sort((a, b) => a.time - b.time);

    // 범위를 벗어나는 경우 처리
    if (reactionTime <= sortedRanges[0].time) return sortedRanges[0].rate;
    if (reactionTime >= sortedRanges[sortedRanges.length - 1].time) {
      return Math.max(5, sortedRanges[sortedRanges.length - 1].rate); // 최소 5%
    }

    // 구간 찾기 및 선형 보간법 적용
    for (let i = 0; i < sortedRanges.length - 1; i++) {
      const currentRange = sortedRanges[i];
      const nextRange = sortedRanges[i + 1];

      if (reactionTime >= currentRange.time && reactionTime <= nextRange.time) {
        const timeRatio =
          (reactionTime - currentRange.time) /
          (nextRange.time - currentRange.time);
        const rateRange = nextRange.rate - currentRange.rate;

        // 보정 계수 적용
        const correctedRatio = Math.pow(1 - timeRatio, correction);

        return Math.max(
          5,
          Math.round(currentRange.rate - rateRange * (1 - correctedRatio))
        ); // 최소 5% 보장
      }
    }

    return 5; // 기본값도 5%로 설정
  };

  return { calculateSuccessRate };
};
