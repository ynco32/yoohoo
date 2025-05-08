import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setUser } from '@/store/slices/userSlice';
import { ReviewHeader } from './ReviewHeader';
import { UserInfo } from '@/types/user';
import { action } from '@storybook/addon-actions';

// 테스트용 스토어 생성
const createTestStore = (userId: number | null = null) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  if (userId !== null) {
    const mockUser: UserInfo = {
      userId,
      nickname: '테스트 사용자',
      email: 'test@example.com',
      userName: '홍길동',
      characterUrl: '/images/dummy.png',
      role: 'ROLE_USER',
    };

    store.dispatch(setUser(mockUser));
  }

  return store;
};

// 컨테이너 스타일 정의
const containerStyle = {
  width: '340px',
  border: '1px solid #eee',
  borderRadius: '8px',
  padding: '12px',
  boxSizing: 'border-box' as 'border-box',
};

// 간략화된 데코레이터 함수 - 타입 명시 제거
const withReduxProvider = (StoryFn: any, context: any) => {
  const { parameters } = context;
  const store = createTestStore(parameters.userId || null);

  // 원시 JSX를 직접 반환
  return (
    <Provider store={store}>
      <div style={containerStyle}>
        <StoryFn />
      </div>
    </Provider>
  );
};

const meta = {
  title: 'Components/ReviewHeader',
  component: ReviewHeader,
  decorators: [withReduxProvider],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    concertTitle: { control: 'text' },
    nickName: { control: 'text' },
    writerId: { control: 'number' },
    reviewId: { control: 'number' },
    profilePicture: { control: 'text' },
    seatInfo: { control: 'text' },
    onEdit: { action: 'edit-clicked' },
  },
} satisfies Meta<typeof ReviewHeader>;

export default meta;
type Story = StoryObj<typeof ReviewHeader>;

// 기본 스토리 (다른 사용자의 리뷰)
export const Default: Story = {
  args: {
    concertTitle: '2024 아이유 콘서트: 페스티벌',
    nickName: '콘서트러버',
    writerId: 2,
    reviewId: 12345,
    profilePicture: '/images/dummy.png',
    seatInfo: 'A구역 12열 23번',
    onEdit: action('edit-clicked'),
  },
  parameters: {
    userId: 1, // 현재 로그인한 사용자 ID (작성자와 다름)
  },
};

// 본인이 작성한 리뷰 스토리 (메뉴 버튼 표시)
export const AuthorView: Story = {
  args: {
    concertTitle: '2024 아이유 콘서트: 페스티벌',
    nickName: '콘서트러버',
    writerId: 1,
    reviewId: 12345,
    profilePicture: '/images/dummy.png',
    seatInfo: 'A구역 12열 23번',
    onEdit: action('edit-clicked'),
  },
  parameters: {
    userId: 1, // 현재 로그인한 사용자 ID (작성자와 동일)
  },
};

// 긴 콘서트 제목과 좌석 정보의 경우를 테스트하기 위한 스토리
export const LongTexts: Story = {
  args: {
    concertTitle: '2024 월드 투어: 매우 긴 콘서트 제목입니다 확인해보세요',
    nickName: '콘서트러버',
    writerId: 2,
    reviewId: 12345,
    profilePicture: '/images/dummy.png',
    seatInfo: 'A구역 12열 23번 아주 긴 좌석정보',
    onEdit: action('edit-clicked'),
  },
  parameters: {
    userId: 1,
  },
};
