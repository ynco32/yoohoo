'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { SharingLocationSelect } from '@/components/features/sharing/SharingLocationSelect';
import { Modal } from '@/components/common/Modal';
import { VENUE_COORDINATES } from '@/lib/constans/venues';
import { SharingWriteFormContainer } from '@/components/features/sharing/SharingWriteFormContainer';

interface LocationInfo {
  latitude: number;
  longitude: number;
}

export default function SharingWritePage() {
  const router = useRouter();
  const [step, setStep] = useState<'location' | 'form'>('location');
  const [location, setLocation] = useState<LocationInfo | null>(null);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const params = useParams();
  const concertId =
    params.concertId !== undefined ? Number(params.concertId) : 0;

  const handleLocationSelect = (locationInfo: LocationInfo) => {
    setLocation(locationInfo);
    setStep('form');
  };

  const handleModalClose = () => {
    setIsCompleteModalOpen(false);
    router.push(`/sharing/${concertId}`);
  };

  return (
    <>
      {step === 'location' && (
        <div className="h-screen">
          <SharingLocationSelect
            onLocationSelect={handleLocationSelect}
            venueLocation={VENUE_COORDINATES.KSPO_DOME}
            initialLocation={location || VENUE_COORDINATES.KSPO_DOME}
          />
        </div>
      )}
      {step === 'form' && location && (
        <div className="h-full">
          <SharingWriteFormContainer
            location={location}
            concertId={concertId}
          />
        </div>
      )}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={handleModalClose}
        title="등록이 완료되었습니다"
        type="alert"
        variant="primary"
      />
    </>
  );
}
