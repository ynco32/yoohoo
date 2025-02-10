import { CongestionDisplay } from '@/components/features/congestion/CongestionDisplay';
import { congestionAPI } from '@/lib/api/congestion';
import { useParams } from 'next/navigation';

export default async function CongestionPage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const params = useParams();
  const arenaId = Number(params.arenaId);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">실시간 혼잡도</h1>
      <CongestionDisplay data={congestions} />
    </div>
  );
}
/*
이 페이지가 로드될 때
1. arenaId로 lacation을 받아와야 한다.
2. 가져온 location 정보로 SKT에서 혼잡도를 받아와야 한다.
3. 받아온 혼잡도를 컴포넌트에 넘겨줘야 한다.
*/
