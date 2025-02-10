import TicketingHeader from '@/components/ui/TicketingHeader';
import TicketingInfo from '@/components/features/ticketing/TicketingInfo';
export default function Page1({
  fixedButtonOnClick,
}: {
  fixedButtonOnClick: () => void;
}) {
  return (
    <div>
      <TicketingHeader></TicketingHeader>
      <TicketingInfo fixedButtonOnClick={fixedButtonOnClick} />
    </div>
  );
}
