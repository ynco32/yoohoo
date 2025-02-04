interface PerformanceInfoProps {
  title: string;
  info: string;
}

export default function PerformanceInfo({ title, info }: PerformanceInfoProps) {
  return (
    <div className="my-2 flex">
      <div className="mr-5 text-gray-500">{title}</div>
      <div>{info}</div>
    </div>
  );
}
