// src/components/Header.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';
import { HeaderContext } from './HeaderProvider';
import { ArenaInfo } from '@/types/arena';

// HeaderContext의 타입 정의
interface HeaderContextType {
  title: string;
  shouldShowDetail: boolean;
  shouldShowLogo: boolean;
  arenaInfo: ArenaInfo | null;
  seatDetail: string | null;
  handleBack: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  setArenaInfo: (info: ArenaInfo | null) => void;
  setSeatDetail: (detail: string | null) => void;
}

// 모의 경기장 정보
const mockArenaInfo: ArenaInfo = {
  arenaId: 1,
  arenaName: '올림픽공원 체조경기장',
  arenaEngName: 'KSPO DOME',
  address: '서울 송파구 올림픽로 424',
  latitude: 37.519206,
  longitude: 127.127349,
  photoUrl: '/images/dummy.png',
};

// 모의 컨텍스트 값 정의
const mockHeaderContext: HeaderContextType = {
  title: '시야 보기',
  shouldShowLogo: false,
  shouldShowDetail: false,
  arenaInfo: null,
  seatDetail: null,
  handleBack: () => console.log('뒤로 가기 클릭됨'),
  isMenuOpen: false,
  setIsMenuOpen: (isOpen: boolean) => console.log('메뉴 상태 변경:', isOpen),
  setArenaInfo: (info: ArenaInfo | null) =>
    console.log('경기장 정보 설정:', info),
  setSeatDetail: (detail: string | null) =>
    console.log('좌석 정보 설정:', detail),
};

// HeaderProvider 컴포넌트를 모킹하기 위한 래퍼 컴포넌트 타입 정의
interface HeaderContextWrapperProps {
  children: React.ReactNode;
  contextValue: HeaderContextType;
}

// 타입이 지정된 래퍼 컴포넌트
const HeaderContextWrapper = ({
  children,
  contextValue,
}: HeaderContextWrapperProps) => (
  <HeaderContext.Provider value={contextValue}>
    {children}
  </HeaderContext.Provider>
);

// 스토리 매개변수 타입 정의
interface HeaderStoryArgs {
  title?: string;
  shouldShowLogo?: boolean;
  shouldShowDetail?: boolean;
  arenaInfo?: ArenaInfo | null;
  seatDetail?: string | null;
}

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  // 데코레이터를 사용하여 컨텍스트 제공
  decorators: [
    (Story, context) => {
      // 스토리 args에서 컨텍스트 값 가져오기
      const args = (context.args as HeaderStoryArgs) || {};
      const { title, shouldShowLogo, shouldShowDetail, arenaInfo, seatDetail } =
        args;

      const contextValue: HeaderContextType = {
        ...mockHeaderContext,
        title: title !== undefined ? title : mockHeaderContext.title,
        shouldShowLogo:
          shouldShowLogo !== undefined
            ? shouldShowLogo
            : mockHeaderContext.shouldShowLogo,
        shouldShowDetail:
          shouldShowDetail !== undefined
            ? shouldShowDetail
            : mockHeaderContext.shouldShowDetail,
        arenaInfo:
          arenaInfo !== undefined ? arenaInfo : mockHeaderContext.arenaInfo,
        seatDetail:
          seatDetail !== undefined ? seatDetail : mockHeaderContext.seatDetail,
      };

      return (
        <HeaderContextWrapper contextValue={contextValue}>
          <Story />
        </HeaderContextWrapper>
      );
    },
  ],
  // 매개변수 설정
  parameters: {
    layout: 'fullscreen',
    // 컴포넌트 문서화를 위한 docs 매개변수 추가
    docs: {
      description: {
        component: `
# 헤더 컴포넌트

앱의 모든 페이지 상단에 표시되는 헤더 컴포넌트입니다. 현재 페이지에 따라 다음 요소들을 동적으로 표시합니다:

- 현재 페이지 제목
- 메인 페이지에서는 로고, 그 외 페이지에서는 뒤로가기 버튼
- 메뉴 버튼
- 경기장 상세 정보와 좌석 정보 (상세 보기 모드)

## 주요 기능

- **경로 기반 타이틀 표시**: 현재 경로에 따라 적절한 페이지 제목 표시
- **컨텍스트 기반 로고/뒤로가기 전환**: 메인 페이지에서는 로고를, 그 외 페이지에서는 뒤로가기 버튼 표시
- **스마트 뒤로가기**: 단순한 브라우저 히스토리 뒤로가기가 아닌, 애플리케이션 흐름에 맞는 지능적인 뒤로가기 기능 제공
- **상세 보기 모드**: 경기장 이미지와 함께 경기장 이름 및 좌석 정보를 표시하는 확장된 헤더 모드

## 사용 예시

\`\`\`tsx
// src/app/layout.tsx
import { HeaderProvider } from '@/components/HeaderProvider';

export default function RootLayout({ children }) {
  return (
    <html lang='ko'>
      <body>
        <HeaderProvider>
          {children}
        </HeaderProvider>
      </body>
    </html>
  );
}
\`\`\`

## 참고 사항

- 이 컴포넌트는 HeaderProvider와 함께 사용해야 합니다.
- HeaderProvider는 경로 변경 추적 및 뒤로가기 기능을 담당합니다.
- 경기장 상세 보기 및 좌석 정보는 useHeader 훅의 setArenaInfo와 setSeatDetail 함수로 설정할 수 있습니다.
`,
      },
    },
  },
  // args 컨트롤을 위한 설정
  argTypes: {
    title: {
      control: 'text',
      description: '헤더에 표시될 타이틀',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '경로에 따라 자동 결정' },
      },
    },
    shouldShowLogo: {
      control: 'boolean',
      description:
        '로고 표시 여부 (true: 로고 표시, false: 뒤로가기 버튼 표시)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false (메인 페이지 제외)' },
      },
    },
    shouldShowDetail: {
      control: 'boolean',
      description: '상세 정보 헤더 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    arenaInfo: {
      control: 'object',
      description: '경기장 정보 객체',
      table: {
        type: { summary: 'ArenaInfo | null' },
        defaultValue: { summary: 'null' },
      },
    },
    seatDetail: {
      control: 'text',
      description: '좌석 상세 정보 (구역, 열, 번호 등)',
      table: {
        type: { summary: 'string | null' },
        defaultValue: { summary: 'null' },
      },
    },
  },
  // 컴포넌트 태그 추가
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

// 뒤로가기 버튼이 있는 헤더 (기본)
export const WithBackButton: Story = {
  args: {
    title: '시야 보기',
    shouldShowLogo: false,
    shouldShowDetail: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          '대부분의 페이지에서 보이는 기본 헤더입니다. 타이틀과 뒤로가기 버튼을 포함합니다.',
      },
    },
  },
};

// 로고가 있는 헤더
export const WithLogo: Story = {
  args: {
    title: '',
    shouldShowLogo: true,
    shouldShowDetail: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          '메인 페이지에서 보이는 헤더입니다. 로고를 표시하고 뒤로가기 버튼은 숨깁니다.',
      },
    },
  },
};

// 상세 정보 헤더 - 경기장 정보만
export const DetailHeader: Story = {
  args: {
    shouldShowDetail: true,
    arenaInfo: mockArenaInfo,
    seatDetail: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          '경기장 정보를 표시하는 상세 헤더입니다. 경기장 이미지와 이름을 표시합니다.',
      },
    },
  },
};

// 상세 정보 헤더 - 경기장 정보와 좌석 정보
export const DetailHeaderWithSeat: Story = {
  args: {
    shouldShowDetail: true,
    arenaInfo: mockArenaInfo,
    seatDetail: 'R구역 5열 21번',
  },
  parameters: {
    docs: {
      description: {
        story: '경기장 정보와 좌석 정보를 함께 표시하는 상세 헤더입니다.',
      },
    },
  },
};

// 다양한 타이틀 변형
export const ReviewTitle: Story = {
  args: {
    title: '리뷰 쓰기',
    shouldShowLogo: false,
  },
  parameters: {
    docs: {
      description: {
        story: '리뷰 작성 페이지의 헤더입니다.',
      },
    },
  },
};

export const ShareMapTitle: Story = {
  args: {
    title: '나눔 지도',
    shouldShowLogo: false,
  },
  parameters: {
    docs: {
      description: {
        story: '나눔 지도 페이지의 헤더입니다.',
      },
    },
  },
};

export const MyPageTitle: Story = {
  args: {
    title: '마이페이지',
    shouldShowLogo: false,
  },
  parameters: {
    docs: {
      description: {
        story: '마이페이지의 헤더입니다.',
      },
    },
  },
};

export const TicketingTitle: Story = {
  args: {
    title: '티켓팅 연습',
    shouldShowLogo: false,
  },
  parameters: {
    docs: {
      description: {
        story: '티켓팅 연습 페이지의 헤더입니다.',
      },
    },
  },
};

// 타이틀 없는 헤더
export const NoTitle: Story = {
  args: {
    title: '',
    shouldShowLogo: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '타이틀이 없는 헤더의 예시입니다. 특별한 페이지에서만 사용됩니다.',
      },
    },
  },
};
