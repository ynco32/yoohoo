import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Captcha from './Captcha';

// 메타데이터 정의
const meta: Meta<typeof Captcha> = {
  title: 'Ticketing/Captcha',
  component: Captcha,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '캡차 모달이 열려있는지 여부',
    },
    onPostpone: {
      action: 'postponed',
      description: '나중에 입력하기 버튼 클릭 시 호출되는 함수',
    },
    onSuccess: {
      action: 'success',
      description: '캡차 인증 성공 시 호출되는 함수',
    },

    className: {
      control: 'text',
      description: '추가 CSS 클래스명',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Captcha>;

// 기본 스토리
export const Default: Story = {
  args: {
    isOpen: true,
  },
};

// 컨트롤러를 사용한 인터랙티브 데모
export const Interactive: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [success, setSuccess] = useState(false);

    const handleOpen = () => {
      setIsOpen(true);
      setSuccess(false);
    };

    const handleSuccess = () => {
      setIsOpen(false);
      setSuccess(true);
    };

    const handlePostpone = () => {
      setIsOpen(false);
    };

    return (
      <div style={{ textAlign: 'center' }}>
        {!isOpen && !success && (
          <button
            onClick={handleOpen}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4986e8',
              color: 'white',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            티켓 예매하기
          </button>
        )}

        {success && (
          <div style={{ color: 'green', marginBottom: '20px' }}>
            ✅ 캡차 인증에 성공했습니다!
          </div>
        )}

        {success && (
          <button
            onClick={handleOpen}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4986e8',
              color: 'white',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            다시 시도하기
          </button>
        )}

        <Captcha
          {...args}
          isOpen={isOpen}
          onSuccess={handleSuccess}
          onPostpone={handlePostpone}
        />
      </div>
    );
  },
};

// 오류 상태 테스트
export const WithError: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState(true);

    const CustomCaptcha = () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [inputText, setInputText] = useState('');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [captchaText] = useState('ABCDEF');

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        if (error) setError(false);
      };

      const handleSubmit = () => {
        if (captchaText === inputText.toUpperCase()) {
          alert('성공!');
        } else {
          setError(true);
        }
      };

      // 원래 컴포넌트의 일부 내부 로직만 복제하여 항상 오류 상태 보여주기
      return (
        <Captcha isOpen={true} onSuccess={() => {}} onPostpone={() => {}} />
      );
    };

    return <CustomCaptcha />;
  },
};
