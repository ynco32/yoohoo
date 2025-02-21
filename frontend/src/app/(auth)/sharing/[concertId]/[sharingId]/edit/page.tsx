'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SharingLocationSelect } from '@/components/features/sharing/SharingLocationSelect';
import { Modal } from '@/components/common/Modal';
import { VENUE_COORDINATES } from '@/lib/constants/venues';
import { SharingFormContainer } from '@/components/features/sharing/SharingFormContainer';
import { SharingFormData } from '@/types/sharing';
import { sharingAPI } from '@/lib/api/sharing';

interface LocationInfo {
  latitude: number;
  longitude: number;
}

export default function SharingEditPage() {
  const router = useRouter();
  const params = useParams();
  const concertId = Number(params.concertId);
  const sharingId = Number(params.sharingId);

  const [step, setStep] = useState<'location' | 'form'>('form'); // 수정은 form부터 시작
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 폼 데이터 상태
  const [formData, setFormData] = useState<SharingFormData>({
    title: '',
    content: '',
    startTime: '',
    image: null,
    latitude: 0,
    longitude: 0,
    concertId,
  });

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchSharingDetail = async () => {
      try {
        const data = await sharingAPI.getSharingDetail(sharingId);

        // 이미지 URL을 Blob으로 변환
        let imageFile;
        if (data.photoUrl) {
          try {
            const response = await fetch(data.photoUrl);
            const blob = await response.blob();
            imageFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          } catch (error) {
            console.error('Error converting image URL to File:', error);
          }
        }

        setFormData({
          title: data.title,
          content: data.content,
          startTime: data.startTime,
          latitude: data.latitude ?? 0,
          longitude: data.longitude ?? 0,
          image: imageFile ?? null,
          concertId: concertId,
        });

        setLocation({
          latitude: data.latitude ?? 0,
          longitude: data.longitude ?? 0,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sharing detail:', error);
        router.push('/sharing'); // 에러 시 목록으로 이동
      }
    };

    fetchSharingDetail();
  }, [sharingId, concertId, router]);

  const handleLocationSelect = (locationInfo: LocationInfo) => {
    setLocation(locationInfo);
    setFormData((prev) => ({
      ...prev,
      latitude: locationInfo.latitude,
      longitude: locationInfo.longitude,
    }));
    setStep('form');
  };

  const handleLocationReset = () => {
    setStep('location');
  };

  const handleSubmitComplete = () => {
    setIsCompleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCompleteModalOpen(false);
    router.replace(`/sharing/${concertId}/${sharingId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <SharingFormContainer
            mode="edit"
            location={location}
            sharingId={sharingId}
            initialData={formData}
            setFormData={setFormData}
            onLocationReset={handleLocationReset}
            onSubmitComplete={handleSubmitComplete}
          />
        </div>
      )}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={handleModalClose}
        title="수정이 완료되었습니다"
        type="alert"
        variant="primary"
      />
    </>
  );
}
