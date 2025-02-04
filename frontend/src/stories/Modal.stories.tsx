import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '@/components/common/Modal';

const meta: Meta<typeof Modal> = {
  title: 'common/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        inline: false,
        iframeHeight: 300,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// 모달을 감싸는 컨테이너 컴포넌트
const ModalContainer = (Story: any) => (
  <div style={{ position: 'relative', height: '300px', width: '100%' }}>
    <Story />
  </div>
);

export const Alert: Story = {
  decorators: [ModalContainer],
  args: {
    isOpen: true,
    title: '알림 메시지입니다.',
    onClose: () => console.log('Modal closed'),
    type: 'alert',
  },
};

export const Confirm: Story = {
  decorators: [ModalContainer],
  args: {
    isOpen: true,
    title: '확인이 필요한 메시지입니다.',
    onClose: () => console.log('Modal cancelled'),
    onConfirm: () => console.log('Modal confirmed'),
    type: 'confirm',
  },
};

export const DangerConfirm: Story = {
  decorators: [ModalContainer],
  args: {
    isOpen: true,
    title: '정말 삭제하시겠습니까?',
    confirmText: '삭제',
    onClose: () => console.log('Modal cancelled'),
    onConfirm: () => console.log('Modal confirmed'),
    type: 'confirm',
    variant: 'danger',
  },
};