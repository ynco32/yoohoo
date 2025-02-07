interface TicketingRefreshButtonProps {
  onClick: () => void;
}

export default function TicketingRefreshButton({
  onClick,
}: TicketingRefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border-gray-500 px-4 py-2 text-gray-500"
    >
      새로고침
    </button>
  );
}
