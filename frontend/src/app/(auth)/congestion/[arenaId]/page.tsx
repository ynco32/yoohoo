'use client';

import { useEffect, useState } from 'react';
import { CongestionDisplay } from '@/components/features/congestion/CongestionDisplay';
import { congestionAPI } from '@/lib/api/congestion';
import { useParams } from 'next/navigation';

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
      const locations = (await congestionAPI.getLocations(arenaId)).locations;

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">실시간 혼잡도</h1>
      <CongestionDisplay data={congestions} />
    </div>
  );
}
