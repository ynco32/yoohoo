interface TicketingBillButtonProps {
  children: string;
  className?: string;
  onClick?: () => void;
}

export const TicketingBillButton = ({
  children,
  onClick,
  className = '',
}: TicketingBillButtonProps) => (
  <button
    onClick={onClick}
    className={`w-full bg-primary-main py-4 font-medium text-white ${className}`}
  >
    {children}
  </button>
);
