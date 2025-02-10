'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { SharingLocationSelect } from '@/components/features/sharing/SharingLocationSelect';
import { Modal } from '@/components/common/Modal';
import { VENUE_COORDINATES } from '@/lib/constans/venues';
import { SharingWriteFormContainer } from '@/components/features/sharing/SharingWriteFormContainer';
import { SharingFormData } from '@/types/sharing';

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

  // 위치 선택 후 폼으로 이동할 때 기존 데이터 유지
  const [formData, setFormData] = useState<SharingFormData>({
    title: '',
    content: '',
    startTime: '',
    image: undefined,
    latitude: 0,
    longitude: 0,
    concertId,
  });

  // 위치 선택 시 기존 데이터 유지하면서 위치만 업데이트
  const handleLocationSelect = (locationInfo: LocationInfo) => {
    setLocation(locationInfo);
    setFormData((prev) => ({
      ...prev,
      latitude: locationInfo.latitude,
      longitude: locationInfo.longitude,
    }));
    setStep('form');
  };

  // 위치 다시 선택 시 기존 데이터 유지
  const handleLocationReset = () => {
    setStep('location'); // 위치 설정 화면으로 이동
  };

  // 글 작성 완료 시 모달 오픈
  const handleSubmitComplete = () => {
    setIsCompleteModalOpen(true);
  };

  // 모달 닫기 및 글 목록으로 이동
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
            formData={formData} // 기존 데이터 유지
            setFormData={setFormData} // 기존 데이터 유지 가능하도록 상태 업데이트 함수 전달
            onLocationReset={handleLocationReset}
            onSubmitComplete={handleSubmitComplete}
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
