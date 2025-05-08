import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setUser } from '@/store/slices/userSlice';
import { ReviewCard } from './ReviewCard';
import { UserInfo } from '@/types/user';
import { action } from '@storybook/addon-actions';
import {
  ArtistGrade,
  ReviewData,
  ReviewPhoto,
  ScreenGrade,
  StageGrade,
} from '@/types/review';

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
  width: '375px',
  border: '1px solid #eee',
  borderRadius: '8px',
  boxSizing: 'border-box' as 'border-box',
};

// 데코레이터 함수
const withReduxProvider = (StoryFn: any, context: any) => {
  const { parameters } = context;
  const store = createTestStore(parameters.userId || null);

  return (
    <Provider store={store}>
      <div style={containerStyle}>
        <StoryFn />
      </div>
    </Provider>
  );
};

// 더미 사진 데이터
const dummyPhotos: ReviewPhoto[] = [
  {
    reviewPhotoId: 1,
    reviewId: 1,
    photoUrl: '/images/dummy.png',
  },
  {
    reviewPhotoId: 2,
    reviewId: 1,
    photoUrl: '/images/dummyArtist.png',
  },
  {
    reviewPhotoId: 3,
    reviewId: 1,
    photoUrl: '/images/dummy.png',
  },
];

// 리뷰 목 데이터 생성 함수
const createMockReview = (
  reviewId: number,
  userId: number,
  concertTitle: string,
  nickName: string,
  profilePicture: string,
  section: string,
  rowLine: number,
  columnLine: number,
  content: string,
  artistGrade: ArtistGrade,
  stageGrade: StageGrade,
  screenGrade: ScreenGrade,
  photos: ReviewPhoto[] = [],
  cameraBrand?: string,
  cameraModel?: string
): ReviewData => {
  return {
    reviewId,
    userId,
    concertId: 1,
    concertTitle,
    seatId: 1,
    section,
    rowLine,
    columnLine,
    artistGrade,
    stageGrade,
    screenGrade,
    content,
    createdAt: '2024-04-01T12:00:00Z',
    nickName,
    profilePicture,
    photos,
    cameraBrand,
    cameraModel,
    getSeatInfoString: function () {
      return `${this.section} ${this.rowLine}열 ${this.columnLine}번`;
    },
  };
};

const meta = {
  title: 'Sight/ReviewCard',
  component: ReviewCard,
  decorators: [withReduxProvider],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    review: { control: 'object' },
    onEdit: { action: 'edit-clicked' },
    onDelete: { action: 'delete-clicked' },
  },
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof ReviewCard>;

// 기본 스토리 (다른 사용자의 리뷰)
export const Default: Story = {
  args: {
    review: createMockReview(
      12345, // reviewId
      2, // userId (작성자 ID)
      '2024 아이유 콘서트: 페스티벌', // concertTitle
      '콘서트러버', // nickName
      '/images/dummy.png', // profilePicture
      'A구역', // section
      12, // rowLine
      23, // columnLine
      '정말 좋은 좌석이었어요! 아이유가 너무 가깝게 보여서 감동이었습니다. 무대 세트와 조명도 훌륭했어요. 다음에도 이 좌석에서 보고 싶네요.',
      ArtistGrade.CLOSE,
      StageGrade.CLEAR,
      ScreenGrade.CLEAR,
      dummyPhotos.slice(0, 2),
      'iPhone',
      '13 Pro'
    ),
    onEdit: action('edit-clicked'),
    onDelete: action('delete-clicked'),
  },
  parameters: {
    userId: 1, // 현재 로그인한 사용자 ID (작성자와 다름)
  },
};

// 본인이 작성한 리뷰 스토리 (메뉴 버튼 표시)
export const AuthorView: Story = {
  args: {
    review: createMockReview(
      12345, // reviewId
      1, // userId (작성자와 동일)
      '2024 아이유 콘서트: 페스티벌', // concertTitle
      '콘서트러버', // nickName
      '/images/dummy.png', // profilePicture
      'A구역', // section
      12, // rowLine
      23, // columnLine
      '정말 좋은 좌석이었어요! 아이유가 너무 가깝게 보여서 감동이었습니다. 무대 세트와 조명도 훌륭했어요.',
      ArtistGrade.CLOSE,
      StageGrade.CLEAR,
      ScreenGrade.CLEAR,
      dummyPhotos.slice(0, 3)
    ),
    onEdit: action('edit-clicked'),
    onDelete: action('delete-clicked'),
  },
  parameters: {
    userId: 1, // 현재 로그인한 사용자 ID (작성자와 동일)
  },
};

// 사진이 없는 리뷰
export const NoPhotos: Story = {
  args: {
    review: createMockReview(
      12345, // reviewId
      2, // userId
      '2024 아이유 콘서트: 페스티벌', // concertTitle
      '콘서트러버', // nickName
      '/images/dummy.png', // profilePicture
      'A구역', // section
      12, // rowLine
      23, // columnLine
      '사진은 없지만 정말 좋은 좌석이었어요! 아이유가 너무 가깝게 보여서 감동이었습니다.',
      ArtistGrade.CLOSE,
      StageGrade.SIDE,
      ScreenGrade.BLOCKED,
      []
    ),
    onEdit: action('edit-clicked'),
    onDelete: action('delete-clicked'),
  },
  parameters: {
    userId: 1,
  },
};

// 모든 등급이 다른 리뷰
export const DifferentGrades: Story = {
  args: {
    review: createMockReview(
      12345, // reviewId
      2, // userId
      '2024 아이유 콘서트: 페스티벌', // concertTitle
      '콘서트러버', // nickName
      'https://via.placeholder.com/40x40/4986e8/ffffff?text=User', // profilePicture
      'C구역', // section
      30, // rowLine
      45, // columnLine
      '멀리서 봤지만 그래도 분위기는 좋았어요. 스크린이 측면에서 보여서 조금 아쉬웠습니다.',
      ArtistGrade.FAR,
      StageGrade.SIDE,
      ScreenGrade.SIDE,
      dummyPhotos.slice(0, 1),
      'Canon',
      'EOS R5'
    ),
    onEdit: action('edit-clicked'),
    onDelete: action('delete-clicked'),
  },
  parameters: {
    userId: 1,
  },
};
