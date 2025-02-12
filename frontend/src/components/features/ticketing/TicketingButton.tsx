import React from 'react';
import FixedButton from '@/components/ui/FixedButton';
import { useTicketingSocket } from '@/hooks/useTicketingSocket';

interface TicketingButtonProps {
  onReservationStart: () => void;
}

const TicketingButton = ({ onReservationStart }: TicketingButtonProps) => {
  const { ticketingState, formatOpenTime, formatCountdown } =
    useTicketingSocket();
  const { status, openTime, countdown } = ticketingState;

  const getButtonConfig = () => {
    switch (status) {
      case 'BEFORE_OPEN':
        return {
          text: openTime ? formatOpenTime(openTime) : '로딩중...',
          disabled: true,
        };

      case 'COUNT_DOWN':
        return {
          text:
            countdown !== null
              ? formatCountdown(countdown)
              : '잠시만 기다려주세요...',
          disabled: true,
        };

      case 'OPEN':
        return {
          text: '예매하기',
          disabled: false,
        };

      default:
        return {
          text: '오류가 발생했습니다',
          disabled: true,
        };
    }
  };

  const { text, disabled } = getButtonConfig();

  return (
    <FixedButton
      fixedButtonOnClick={onReservationStart}
      isfixedButtonDisabled={disabled}
    >
      {text}
    </FixedButton>
  );
};

export default TicketingButton;
