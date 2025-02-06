import Image from 'next/image';
import Badge from './Badge';

const TicketingHeader = () => {
  return (
    <div className="flex bg-gray-100">
      <Image
        className="mx-4 my-4"
        src="/images/poster.png"
        alt="poster"
        width={80}
        height={150}
      />
      <div className="mr-4 py-5">
        <div className="flex justify-start gap-1">
          <Badge type="green">단독판매</Badge>
          <Badge type="pink">인증예매</Badge>
        </div>
        <div className="my-2">
          <h3 className="mb-5 text-title-bold">
            20XX ASIA TOUR CONCERT in SEOUL
          </h3>
          <p className="text-caption2">콘서트 | 7세 이상</p>
        </div>
      </div>
    </div>
  );
};
export default TicketingHeader;
