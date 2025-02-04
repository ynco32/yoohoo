interface ConcertScheduleButtonProps {
  children: string;
  onClick: () => void;
}

export default function ConcertScheduleButton({
  children,
  onClick,
}: ConcertScheduleButtonProps) {
  return (
    <button className="w-fill px-4 py-3" onClick={onClick}>
      <p>{children}</p>
    </button>
  );
}
