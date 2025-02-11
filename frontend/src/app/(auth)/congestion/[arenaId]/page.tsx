'use client';

import { useEffect, useState } from 'react';
import { CongestionMap } from '@/components/features/congestion/CongestionMap';
import { congestionAPI } from '@/lib/api/congestion';
import { useParams } from 'next/navigation';
import { locationInfo } from '@/lib/utils/locationInfo';

interface LocationInfo {
  latitude: number;
  longitude: number;
}

interface ProcessedCongestion {
  congestion: number;
}

interface CongestionData {
  location: LocationInfo;
  congestion: ProcessedCongestion;
}

export default function CongestionPage() {
  const params = useParams();
  const arenaId = Number(params.arenaId);
  const [congestions, setCongestions] = useState<CongestionData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const arena = locationInfo.find((arena) => arena.arenaId === arenaId);

      const locations = arena?.locations;

      if (!locations) return;

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
    };

    fetchData();
  }, [arenaId]);

  return (
    <div className="container mx-auto px-4">
      {congestions.length > 0 ? (
        <CongestionMap data={congestions} />
      ) : (
        <div>데이터가 없습니다.</div>
      )}
    </div>
  );
}
