interface TicketingDetailsProps {
  title: string;
  info: React.ReactNode;
}

export default function TicketingDetails({
  title,
  info,
}: TicketingDetailsProps) {
  return (
    <div className="border-b border-t border-gray-100 bg-gray-50">
      <div className="mx-4 my-3">
        <h3 className="py-2 text-subTitle">{title}</h3>
        <p className="whitespace-pre-wrap leading-none">{info}</p>
      </div>
    </div>
  );
}
