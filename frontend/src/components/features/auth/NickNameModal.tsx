'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import api from '@/lib/api/axios';
import axios from 'axios';

interface NickNameState {
  value: string;
  isChecked: boolean;
  isLoading: boolean;
  message: {
    text: string;
    type: 'success' | 'error' | 'none';
  };
}

const NickNameModal = () => {
  const router = useRouter();
  const [state, setState] = useState<NickNameState>({
    value: '',
    isChecked: false,
    isLoading: false,
    message: { text: '', type: 'none' },
  });

  const setMessage = (text: string, type: 'success' | 'error' | 'none') => {
    setState((prev) => ({ ...prev, message: { text, type } }));
  };

  const handleCheckNickName = async () => {
    if (!state.value.trim()) {
      setMessage('닉네임을 입력해주세요.', 'error');
      return;
    }

    if (state.value.includes(' ')) {
      setMessage('공백을 제거해주세요.', 'error');
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true }));
    // 요청 직전에 config와 헤더 확인
    console.log('API 요청 설정:', api.defaults);
    console.log(
      'Authorization 헤더:',
      api.defaults.headers.common['Authorization']
    );
    try {
      const response = await api.get<boolean>(
        `/api/v1/login/nickname/check?nickname=${state.value}`
      );
      if (response.data) {
        setState((prev) => ({ ...prev, isChecked: true }));
        setMessage('사용 가능한 닉네임입니다.', 'success');
      } else {
        setMessage('이미 사용중인 닉네임입니다.', 'error');
      }
    } catch (error) {
      setMessage('닉네임 중복 확인에 실패했습니다.', 'error');
      // 에러의 기본 정보만 출력
      if (axios.isAxiosError(error)) {
        console.error('handleCheckNickName API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
        });
      }
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSubmit = async () => {
    // 요청 직전에 config와 헤더 확인
    console.log('API 요청 설정:', api.defaults);
    console.log(
      'Authorization 헤더:',
      api.defaults.headers.common['Authorization']
    );

    if (!state.isChecked) {
      setMessage('닉네임 중복 확인을 해주세요.', 'error');
      return;
    }

    if (state.value.length > 20) {
      setMessage('닉네임은 20자 이내로 입력해주세요.', 'error');
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // API 요청 전 설정 확인
      console.log('handleSubmit으로 전송할 닉네임:', state.value);
      console.log(
        'Authorization:',
        api.defaults.headers.common['Authorization']
      );

      const response = await api.post('/api/v1/login/nickname', {
        nickname: state.value,
      });

      // 응답 데이터 확인
      console.log('handleSubmit에 대한 서버 응답:', response.data);

      if (response.status === 200) {
        setMessage('닉네임이 설정되었습니다.', 'success');
        router.push('/main');
      }
    } catch (error) {
      setMessage('닉네임 설정 중 오류가 발생했습니다.', 'error');

      // 에러의 기본 정보만 출력
      if (axios.isAxiosError(error)) {
        console.error('handleSubmit API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
        });
      }
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="w-80 rounded-3xl p-6">
      <div className="mb-4">
        <div className="relative flex h-12 w-full items-center border-b-2 border-sight-button">
          <input
            type="text"
            value={state.value}
            onChange={(e) => {
              setState((prev) => ({
                ...prev,
                value: e.target.value,
                isChecked: false,
              }));
            }}
            placeholder="닉네임을 입력하세요"
            className="h-full w-full rounded-full bg-transparent px-2 text-text-menu placeholder:text-text-description focus:outline-none"
            maxLength={20}
          />
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <SubmitButton
          onClick={handleCheckNickName}
          disabled={state.isLoading}
          className="w-1/2 rounded-card bg-gray-50 px-4 py-2 text-caption1-bold text-text-menu shadow-card-colored hover:shadow-card-hover"
        >
          중복확인
        </SubmitButton>
        <SubmitButton
          onClick={handleSubmit}
          disabled={state.isLoading}
          className="w-1/2 rounded-card bg-white px-4 py-2 text-caption1-bold text-text-menu shadow-card-colored hover:shadow-card-hover"
        >
          {state.isLoading ? '처리중...' : '설정'}
        </SubmitButton>
      </div>

      {state.message.text && (
        <p
          className={`mt-2 text-center text-sm ${
            state.message.type === 'success' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {state.message.text}
        </p>
      )}
    </div>
  );
};

export default NickNameModal;
