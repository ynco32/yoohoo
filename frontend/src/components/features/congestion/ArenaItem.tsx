import { ArenaData } from '@/lib/api/arena';
import Image from 'next/image';
import Link from 'next/link';

export const ArenaItem = ({ arenaId, arenaName, photoUrl }: ArenaData) => {
  return (
    <Link href={`congestion/${arenaId}`}>
      <div className="flex items-center max-w-[430px] w-full">
      <div className="mx-2 mb-3 flex w-[330px] rounded-lg border border-white bg-background-default p-2 shadow-concert">
        <Image
          className="w-26 mr-2 h-24 rounded-lg"
          src={photoUrl}
          alt={arenaName}
          width={100}
          height={100}
        />
        <div className="flex flex-1 items-center justify-center">
          <span className="font-['Pretendard'] text-sm font-bold leading-[19.18px] text-[#505050]">
            {arenaName}
          </span>
        </div>
        </div>
      </div>
    </Link>
  );
};
