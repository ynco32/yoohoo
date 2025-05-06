// src/components/common/ImageUpload/ImageUpload.stories.tsx
import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ImageUpload from './ImageUpload';

const meta: Meta<typeof ImageUpload> = {
  title: 'Sight/ImageUpload',
  component: ImageUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

// 기본 이미지 업로드 컴포넌트
export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [images, setImages] = useState<(File | string)[] | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState<string | undefined>(undefined);

    const handleError = (message: string) => {
      setError(message);
      // 3초 후 에러 메시지 제거
      setTimeout(() => {
        setError(undefined);
      }, 3000);
    };

    return (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <ImageUpload
          value={images}
          onChange={setImages}
          onError={handleError}
          error={error}
        />
      </div>
    );
  },
};

// 미리 이미지가 있는 상태
export const WithPreloadedImages: Story = {
  render: () => {
    // 예시 이미지 URL (실제 사용 가능한 URL로 대체 필요)
    const sampleImageUrls = [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300/ff0000',
    ];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [images, setImages] = useState<(File | string)[] | null>(
      sampleImageUrls
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState<string | undefined>(undefined);

    const handleError = (message: string) => {
      setError(message);
      setTimeout(() => {
        setError(undefined);
      }, 3000);
    };

    return (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <ImageUpload
          value={images}
          onChange={setImages}
          onError={handleError}
          error={error}
        />
        <div style={{ marginTop: '20px' }}>
          <p>현재 업로드된 이미지: {images ? images.length : 0}장</p>
        </div>
      </div>
    );
  },
};

// 최대 이미지 개수 제한 (2장)
export const MaxTwoImages: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [images, setImages] = useState<(File | string)[] | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState<string | undefined>(undefined);

    const handleError = (message: string) => {
      setError(message);
      setTimeout(() => {
        setError(undefined);
      }, 3000);
    };

    return (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <ImageUpload
          value={images}
          onChange={setImages}
          onError={handleError}
          error={error}
          maxImages={2}
          uploadText='최대 2장까지 업로드 가능합니다'
        />
        <div style={{ marginTop: '20px' }}>
          <p>현재 업로드된 이미지: {images ? images.length : 0}장</p>
        </div>
      </div>
    );
  },
};

// 에러 상태
export const WithError: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [images, setImages] = useState<(File | string)[] | null>(null);

    return (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <ImageUpload
          value={images}
          onChange={setImages}
          error='이미지 형식이 올바르지 않습니다.'
        />
      </div>
    );
  },
};

// 다양한 경로에 따른 텍스트 변경 테스트
export const SharingPathText: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [images, setImages] = useState<(File | string)[] | null>(null);

    // 경로를 'sharing'으로 모방하기 위한 래퍼 컴포넌트
    const MockPathWrapper = () => {
      // usePathname 모킹
      const mockPathHook = () => '/sharing/create';

      // 원래 컴포넌트의 usePathname을 모킹으로 대체
      const OriginalComponent = ImageUpload;
      const MockedComponent = (props: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const pathname = mockPathHook();
        return <OriginalComponent {...props} pathname={pathname} />;
      };

      return (
        <MockedComponent value={images} onChange={setImages} maxImages={3} />
      );
    };

    return (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <p>이 예시는 경로가 'sharing'일 때의 텍스트를 시뮬레이션합니다</p>
        <MockPathWrapper />
      </div>
    );
  },
};

// 반응형 테스트
export const ResponsiveTest: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [images, setImages] = useState<(File | string)[] | null>([
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300/0000ff',
    ]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState<string | undefined>(undefined);

    const handleError = (message: string) => {
      setError(message);
      setTimeout(() => {
        setError(undefined);
      }, 3000);
    };

    return (
      <div>
        <p>화면 크기를 조절하여 반응형을 테스트해보세요</p>
        <div style={{ width: '100%' }}>
          <ImageUpload
            value={images}
            onChange={setImages}
            onError={handleError}
            error={error}
          />
        </div>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};
