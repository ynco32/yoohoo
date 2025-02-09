interface TicketingBottomGreenButtonProps {
  children: React.ReactNode;
  type: 'active' | 'nonActive';
}

export default function TicketingBottomGreenButton({
  children,
  type,
}: TicketingBottomGreenButtonProps) {
  const style = {
    active: 'bg-primary-main w-full text-white py-2 px-4',
    nonActive: 'bg-gray-500 text-white w-full disabled py-2 px-4',
  };

  return <button className={style[type]}>{children}</button>;
}
