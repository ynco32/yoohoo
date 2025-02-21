// src/components/features/ticketing/TicketingPracticeResultModal.tsx

import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';
import { useRouter } from 'next/navigation';

interface TicketingPracticeResultModalProps {
  handleRetry: () => void;
  bestScore: number;
  goodScore: number;
  badScore: number;
  successRate?: number;
}

const TicketingPracticeResultModal = ({
  handleRetry,
  // bestScore,
  // goodScore,
  // badScore,
  successRate,
}: TicketingPracticeResultModalProps) => {
  const { reactionTime } = useTicketintPracticeResultStore();
  const router = useRouter();

  const home = () => {
    router.push('../');
  };

  const getSuccessRateEmoji = (rate: number) => {
    if (rate >= 90) return '🎯';
    if (rate >= 70) return '🎯';
    if (rate >= 50) return '🎯';
    return '🎯';
  };

  const getSuccessRateMessage = (rate: number) => {
    if (rate >= 90) return '당신 혹시 매크로?';
    if (rate >= 70) return '티켓팅 성공이 매우 유력해요!';
    if (rate >= 50) return '티켓팅 성공 가능성이 있어요!';
    if (rate >= 30) return '조금 더 연습하면 성공할 수 있어요!';
    if (rate >= 10) return '더 빠른 반응속도가 필요해요...';
    return '우리 취소표를 노려볼까요?';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'from-[#C0FFBD] to-blue-500';
    if (rate >= 70) return 'from-[#C0FFBD] to-blue-500';
    if (rate >= 50) return 'from-[#C0FFBD] to-blue-500';
    return 'from-[#C0FFBD] to-blue-500';
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-ticketing-bg">
      <div className="max-w-md -mt-16 w-96">
        {' '}
        {/* 위치 조정을 위해 margin-top 추가 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-menu">결과</h1>
          <p className="mt-2 text-text-description">당신의 반응 속도는...</p>
        </div>
        <div className="flex h-auto w-full flex-col items-center justify-center rounded-xl py-2">
          <p className="text-6xl font-bold text-sight-button">
            {reactionTime.toFixed(3)}
          </p>
          <p className="my-2 text-xl text-text-description">밀리초</p>

          {successRate !== undefined && (
            <div className="my-6 flex justify-center">
              <div className="relative w-[300px] rounded-2xl bg-white p-6 shadow-card-colored">
                {' '}
                {/* 그림자 색상 변경 */}
                {/* 상단 이모지 장식 */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl">
                  {getSuccessRateEmoji(successRate)}
                </div>
                {/* 성공률 제목 */}
                <p className="mt-2 text-center text-lg font-medium text-gray-600">
                  예상 티켓팅 성공률
                </p>
                {/* 성공률 수치 */}
                <div className="relative mt-4 flex justify-center">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${getSuccessRateColor(successRate)} opacity-10 blur-xl`}
                  />
                  <p
                    className={`bg-gradient-to-r ${getSuccessRateColor(successRate)} bg-clip-text text-5xl font-bold text-transparent`}
                  >
                    {successRate}%
                  </p>
                </div>
                {/* 게이지 바 */}
                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full bg-gradient-to-r ${getSuccessRateColor(successRate)} transition-all duration-1000`}
                    style={{ width: `${successRate}%` }}
                  />
                </div>
                {/* 메시지 */}
                <p className="mt-4 text-center text-gray-600">
                  {getSuccessRateMessage(successRate)}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleRetry}
            className="text-sight-dark text-body-black h-14 w-36 rounded-card bg-white p-4 shadow-card-colored"
          >
            다시 도전하기
          </button>
          <button
            onClick={home}
            className="text-body-black h-14 w-36 rounded-card bg-white shadow-card-colored"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketingPracticeResultModal;
