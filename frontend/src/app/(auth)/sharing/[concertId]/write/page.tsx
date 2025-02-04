'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { SharingLocationSelect } from '@/components/features/sharing/SharingLocationSelect';
import { SharingWriteForm } from '@/components/features/sharing/SharingWriteForm';
import { SharingCompleteModal } from '@/components/features/sharing/SharingCompleteModal';
import { VENUE_COORDINATES } from '@/lib/constans/venues';
import { SharingFormData } from '@/types/sharing';

interface LocationInfo {
  latitude: number;
  longitude: number;
}

export default function SharingWritePage() {
  const [step, setStep] = useState<'location' | 'form'>('location');
  const [location, setLocation] = useState<LocationInfo | null>(null);

  const [formData, setFormData] = useState<SharingFormData>({
    title: '',
    startTime: '',
    count: '',
    content: '',
  });
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const params = useParams();
  const concertId = params.concertId ? Number(params.concertId) : 0;

  const handleLocationSelect = (locationInfo: LocationInfo) => {
    setLocation(locationInfo);
    setStep('form');
  };

  const handleLocationReset = () => {
    setStep('location');
  };

  const handleSubmitComplete = () => {
    setIsCompleteModalOpen(true);
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
        <SharingWriteForm
          location={location}
          formData={formData}
          onFormChange={setFormData}
          onSubmitComplete={handleSubmitComplete}
          onLocationReset={handleLocationReset}
          concertId={concertId}
        />
      </div>
    )}
    <SharingCompleteModal
      isOpen={isCompleteModalOpen}
      onClose={() => setIsCompleteModalOpen(false)}
    />
  </>
);
}
