interface TicketingBottomGreenButtonProps {
  children: React.ReactNode;
  type: 'active' | 'nonActive';
  onClick?: () => void;
}

export default function TicketingBottomGreenButton({
  children,
  type,
  onClick,
}: TicketingBottomGreenButtonProps) {
  const style = {
    active: 'bg-primary-main w-full text-white py-2 px-4',
    nonActive: 'bg-gray-500 text-white w-full disabled py-2 px-4',
  };

  return (
    <button
      disabled={type === 'nonActive'}
      onClick={onClick}
      className={style[type]}
    >
      {children}
    </button>
  );
}
