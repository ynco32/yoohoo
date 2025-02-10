import Page1 from '@/components/features/ticketing/pages/1';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTicketintPracticeResultStore } from '@/store/ticketintPracticeResult';

export default function Entrance() {
  const router = useRouter();
  const [gameState, setGameState] = useState(''); //counting, waiting
  const [countdown, setCountdown] = useState(5);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const ButtonMessage = () => {
    // 카운트 다운
    if (gameState === 'counting') {
      return countdown + '초 후 열림';
    } else {
      // waiting
      return '예매하기';
    }
  };
  const setReactionTime = useTicketintPracticeResultStore(
    (time) => time.setReactionTime
  );

  const onButtonClick = () => {
    const end = performance.now();
    setEndTime(end);
    const reactionTime = startTime - endTime;
    // router.push('/result', { state: { reactionTime } });
    setReactionTime(reactionTime);
    router.push('/result');
  };

  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000); // 1초에 한 번씩 숫자를 줄이기
    } else if (countdown === 0) {
      // 0초 부터는
      const start = performance.now();
      setGameState('waiting');
      setStartTime(start);
    }
  }, [countdown, gameState]);

  return (
    <div>
      <Page1
        fixedButtonMessage={ButtonMessage()}
        fixedButtonOnClick={onButtonClick}
        isfixedButtonDisabled={gameState === 'counting'} // 카운팅 중이면 비활성화
      />
    </div>
  );
}
