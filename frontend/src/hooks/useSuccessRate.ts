// src/hooks/useSuccessRate.ts

interface ScoreRange {
  time: number;
  rate: number;
}

interface PracticeMode {
  ranges: ScoreRange[];
  correction: number;
  timeLimit: number; // 시간 제한 추가
}

type PracticeModeType = 'entrance' | 'grape' | 'security';

// [React] 연습 모드별 설정
const PRACTICE_MODES: Record<PracticeModeType, PracticeMode> = {
  entrance: {
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
    timeLimit: 500, // 입장 연습 시간 제한
  },
  grape: {
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
    timeLimit: 2500, // 포도알 연습 시간 제한
  },
  security: {
    ranges: [
      { time: 200, rate: 99 },
      { time: 300, rate: 95 },
      { time: 400, rate: 85 },
      { time: 600, rate: 70 },
      { time: 800, rate: 55 },
      { time: 1000, rate: 35 },
      { time: 1200, rate: 20 },
    ],
    correction: 0.8,
    timeLimit: 1500, // 보안 메시지 연습 시간 제한
  },
};

// [React] 성공률 계산 커스텀 훅
export const useSuccessRate = (mode: PracticeModeType) => {
  const calculateSuccessRate = (reactionTime: number): number => {
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
