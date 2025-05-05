// src/app/place/[arenaId]/page.tsx
import PlaceTabs from '@/components/place/PlaceTabs/PlaceTabs'; // 그냥 import

export default async function PlacePage({ params }: { params: { arenaId: string } }) {
    const awaitedParams = await params;
    return <PlaceTabs arenaId={awaitedParams.arenaId} />;
  }