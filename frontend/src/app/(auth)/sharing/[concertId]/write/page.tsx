'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { SharingLocationSelect } from '@/components/features/sharing/SharingLocationSelect';
import { SharingWriteForm } from '@/components/features/sharing/SharingWriteForm';
import { SharingCompleteModal } from '@/components/features/sharing/SharingCompleteModal';
import { VENUE_COORDINATES } from '@/lib/constans/venues';

interface LocationInfo {
  latitude: number;
  longitude: number;
}

export default function SharingWritePage() {
  const [step, setStep] = useState<'location' | 'form'>('location');
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // URL에서 공연 ID 추출
  const params = useParams();
  const concertId = params.concertId ? Number(params.concertId) : 0;

  const handleLocationSelect = (locationInfo: LocationInfo) => {
    setLocation(locationInfo);
    setStep('form');
  };

  const handleSubmitComplete = () => {
    setIsCompleteModalOpen(true);
  };

  return (
    <div className="h-screen">
      {step === 'location' && (
        <SharingLocationSelect
          onLocationSelect={handleLocationSelect}
          venueLocation={VENUE_COORDINATES.KSPO_DOME}
        />
      )}
      {step === 'form' && location && (
        <SharingWriteForm
          location={location}
          onSubmitComplete={handleSubmitComplete}
          concertId={concertId}
        />
      )}
      <SharingCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
      />
    </div>
  );
}
