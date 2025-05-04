'use client';
import React from 'react';
import { useTicketing } from '../TicketingContext'; // 상위 폴더의 Context 사용

const ResultPage = () => {
  // Context에서 반응 시간 가져오기
  const { reactionTime, gameMode } = useTicketing();

  return (
    <div>
      <h2>결과</h2>
      <p>반응 시간: {reactionTime}ms</p>
      <p>어떤 모드?: {gameMode}</p>
      {/* 추가 결과 내용 */}
    </div>
  );
};

export default ResultPage;
