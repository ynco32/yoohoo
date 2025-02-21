interface PerformanceInfoProps {
  title: string;
  info: string;
}

export default function PerformanceInfo({ title, info }: PerformanceInfoProps) {
  return (
    <div className="my-2 flex items-start">
      <div className="w-24 min-w-24 mr-5 text-gray-500">{title}</div>
      <div className="flex-1">{info}</div>
    </div>
  );
}