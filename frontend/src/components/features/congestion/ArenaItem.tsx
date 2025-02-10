import { ArenaData } from '@/lib/api/arena';
import Image from 'next/image';
import Link from 'next/link';

export const ArenaItem = ({ arenaId, arenaName, photoUrl }: ArenaData) => {
  return (
    <Link href={`congestion/${arenaId}`}>
      <div>
        <h3>{arenaId}</h3>
        <p>{arenaName}</p>
        <Image src={photoUrl ?? '/images/card.png'} alt={arenaName} />
      </div>
    </Link>
  );
};
