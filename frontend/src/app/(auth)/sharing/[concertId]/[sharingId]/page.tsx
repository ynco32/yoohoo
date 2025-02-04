'use client';

import { SharingDetail } from '@/components/features/sharing/SharingDetail';
import { useParams } from 'next/navigation';

export default function SharingDetailPage() {
  const params = useParams();
  const sharingId = Number(params.sharingId);
  
  return (
    <SharingDetail id={sharingId} />
  );
}