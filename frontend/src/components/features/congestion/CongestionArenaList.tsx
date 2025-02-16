'use client';

import { /* arenaAPI, */ ArenaData, ArenaResponse } from '@/lib/api/arena';
import { useEffect, useState } from 'react';
import { ArenaItem } from './ArenaItem';

export const ArenaListContainer = () => {
  const [arenas, setArenas] = useState<ArenaData[]>([]);

  useEffect(() => {
    const fetchArenas = async () => {
      // const arenaList = await arenaAPI.getArenas();
      const arenaList = JSON.parse(`
        {
            "arenas": [
                {
                    "arenaId": 1,
                    "arenaName": "올림픽체조경기장",
                    "photoUrl": null
                },
                {
                    "arenaId": 2,
                    "arenaName": "고척스카이돔",
                    "photoUrl": null
                },
                {
                    "arenaId": 3,
                    "arenaName": "SK올림픽 핸드볼경기장",
                    "photoUrl": null
                }
            ]
        }
        `);
      setArenas(arenaList.arenas);
    };

    fetchArenas();
  }, []);

  return <CongestionArenaList arenas={arenas} />;
};

export const CongestionArenaList = ({ arenas }: ArenaResponse) => {
  return (
    <div className="flex flex-col items-center pt-5">
      {arenas.map((arena) => (
        <ArenaItem
          key={arena.arenaId}
          arenaId={arena.arenaId}
          arenaName={arena.arenaName}
          photoUrl={arena.photoUrl}
        />
      ))}
    </div>
  );
};
