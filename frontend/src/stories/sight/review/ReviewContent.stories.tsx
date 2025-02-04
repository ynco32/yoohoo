import type { Meta, StoryObj } from '@storybook/react';
import { ReviewContent } from '../../../components/features/sight/review/ReviewContent';

const meta = {
  title: 'Features/Sight/Review/ReviewContent',
  component: ReviewContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const shortContent = '짧은 리뷰 내용입니다. 말줄임표가 적용되지 않습니다.';
const longContent = `이것은 길이가 긴 리뷰 내용입니다. 말줄임표가 적용되어야 하는 케이스를 테스트하기 위해 
충분히 긴 내용을 작성했습니다. 유저가 작성한 리뷰는 때로는 매우 길 수 있으며, 
이러한 경우 사용자 경험을 위해 initially는 일부만 보여주고 더보기 버튼을 통해 
전체 내용을 확인할 수 있도록 하는 것이 좋습니다. 이 예시에서는 그러한 케이스를 
테스트하고 있습니다. 말줄임표와 더보기 기능이 정상적으로 작동하는지 확인해보세요.`;

export const Short: Story = {
  args: {
    content: shortContent,
  },
};

export const Long: Story = {
  args: {
    content: longContent,
  },
};

export const WithEmoji: Story = {
  args: {
    content: `⭐️ 정말 좋은 자리예요! 전광판도 잘 보이고 가깝습니다.. 
      다음에도 또 가고 싶어요 😊 적극 추천합니다! 👍`,
  },
};

export const WithNewLines: Story = {
  args: {
    content: `첫 번째 줄입니다.
두 번째 줄입니다.
세 번째 줄입니다.
이렇게 여러 줄로 
작성된 리뷰의 경우에도
말줄임표가 잘 처리되는지 
확인해봅니다.`,
  },
};
