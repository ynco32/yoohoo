import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';
import { useRouter } from 'next/navigation';

interface TicketingPracticeResultModalProps {
  handleRetry: () => void;
  bestScore: number;
  goodScore: number;
  badScore: number;
}

const TicketingPracticeResultModal = ({
  handleRetry,
  bestScore,
  goodScore,
  badScore,
}: TicketingPracticeResultModalProps) => {
  const { reactionTime } = useTicketintPracticeResultStore();
  const router = useRouter();

  const home = () => {
    router.push('../');
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">결과</h1>
          <p className="mt-2 text-gray-600">당신의 반응 속도는...</p>
        </div>

        <div className="flex h-48 w-full flex-col items-center justify-center rounded-xl bg-white shadow-sm">
          <p className="text-6xl font-bold text-blue-600">
            {reactionTime.toFixed(3)}
          </p>
          <p className="mt-2 text-xl text-gray-600">밀리초</p>

          <p className="mt-4 text-lg text-gray-800">
            {reactionTime < bestScore
              ? '🦾 당신 매크로입니까?'
              : reactionTime < goodScore
                ? '🎯 놀라운 반응 속도입니다!'
                : reactionTime < badScore
                  ? '👍 평균 이상의 반응 속도네요!'
                  : '💪 조금 더 연습해보세요!'}
          </p>
        </div>

        <button onClick={handleRetry} className="h-14 w-full text-lg">
          다시 도전하기
        </button>
        <button onClick={home} className="h-14 w-full text-lg">
          홈으로
        </button>
      </div>
    </div>
  );
};

export default TicketingPracticeResultModal;
