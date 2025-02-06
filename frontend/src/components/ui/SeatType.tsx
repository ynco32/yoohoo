interface SeatTypeProps {
  seat_name: string;
  seat_color: 'VIP' | 'normal';
}

export default function SeatType({ seat_name, seat_color }: SeatTypeProps) {
  const color = {
    VIP: 'bg-[#BEA886]',
    normal: 'bg-[#9076FF]',
  };
  return (
    <div>
      <span className={`${color[seat_color]} mr-2 inline-block h-4 w-4`}></span>
      <span>{seat_name}</span>
    </div>
  );
}
