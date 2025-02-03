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

  // URL에서 공연 ID 추출
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
    <div className="h-screen">
      {step === 'location' && (
        <SharingLocationSelect
          onLocationSelect={handleLocationSelect}
          venueLocation={VENUE_COORDINATES.KSPO_DOME}
          initialLocation={location || VENUE_COORDINATES.KSPO_DOME}
        />
      )}
      {step === 'form' && location && (
        <SharingWriteForm
          location={location}
          formData={formData} // 폼 데이터 전달
          onFormChange={setFormData} // 폼 데이터 변경 핸들러
          onSubmitComplete={handleSubmitComplete}
          onLocationReset={handleLocationReset}
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
