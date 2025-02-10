import TicketingHeader from '@/components/ui/TicketingHeader';
import TicketingInfo from '@/components/features/ticketing/TicketingInfo';

interface Page1Props {
  fixedButtonOnClick: () => void;
  isfixedButtonDisabled: boolean;
  fixedButtonMessage: React.ReactNode;
}

export default function Page1({
  fixedButtonOnClick,
  isfixedButtonDisabled,
  fixedButtonMessage,
}: Page1Props) {
  return (
    <div>
      <TicketingHeader></TicketingHeader>
      <TicketingInfo
        isfixedButtonDisabled={isfixedButtonDisabled}
        fixedButtonOnClick={fixedButtonOnClick}
        fixedButtonMessage={fixedButtonMessage}
      />
    </div>
  );
}
