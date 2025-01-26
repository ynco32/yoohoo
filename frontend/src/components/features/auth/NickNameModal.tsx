//  api 요청 추가해야 함.

import React from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';

const NickNameModal = () => {
  return (
    <div className="w-80 rounded-3xl bg-primary-sub1 p-6">
      <h2 className="mb-2 text-center text-xl font-medium">닉네임 만들기</h2>
      <p className="mb-6 text-center text-sm text-gray-600">
        좌석 후기 및 나눔글에서 사용됩니다
      </p>

      <div className="relative flex h-12 w-full items-center rounded-full bg-primary-sub2">
        <input
          type="text"
          placeholder="닉네임을 입력하세요"
          className="h-full w-full rounded-full bg-transparent px-6 text-white placeholder:text-white/70 focus:outline-none"
        />
        <div className="absolute right-1">
          <SubmitButton>설정</SubmitButton>
        </div>
      </div>
    </div>
  );
};

export default NickNameModal;
