'use client';

import { useEffect, useState } from 'react';
import { CongestionMap } from '@/components/features/congestion/CongestionMap';
import { congestionAPI } from '@/lib/api/congestion';
import { useParams } from 'next/navigation';
import { locationInfo } from '@/lib/constants/locationInfo';
import { DataError } from '@/components/features/congestion/DataError';
// import { CongestionInfo } from '@/components/features/congestion/CongestionInfo';
// import Badge from '@/components/ui/Badge';

interface LocationInfo {
  latitude: number;
  longitude: number;
}

interface Position {
  latitude: number;
  longitude: number;
}

interface ProcessedCongestion {
  congestion: number;
  congestionLevel: number;
}

interface CongestionData {
  location: LocationInfo;
  congestion: ProcessedCongestion;
}

export default function CongestionPage() {
  const params = useParams();
  const arenaId = Number(params.arenaId);
  const [congestions, setCongestions] = useState<CongestionData[]>([]);
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const arena = locationInfo.find((arena) => arena.arenaId === arenaId);

      const locations = arena?.locations;
      const position = arena?.position;

      if (!locations || !position) return;

      const congestions = await Promise.all(
        locations.map(async (location) => {
          const congestion = await congestionAPI.getCongestionData(location);
          return {
            location,
            congestion,
          };
        })
      );

      setCongestions(congestions);
      setPosition(position);
    };

    fetchData();
  }, [arenaId]);

  return (
    <div className="container relative mx-auto min-h-screen px-4">
      {congestions.length > 0 && position ? (
        <CongestionMap data={congestions} position={position} />
      ) : (
        <DataError />
      )}
    </div>
  );
}
