'use client';

import { SightReviewForm } from '@/components/features/sight/SightReviewForm';

interface SeatInfo {
  section: string;
  row: string;
  number: string;
}

interface SightReviewFormData {
  concertId?: string;
  seat?: SeatInfo;
  images: File[];
  visibility?: number;
  comfort?: string;
  sightLevel?: string;
  comment?: string;
}

const mockApiCall = async (formData: FormData): Promise<{ id: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Submitted FormData contents:');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  return { id: 'mock-review-' + Date.now() };
};

const createFormDataWithFiles = (data: SightReviewFormData) => {
  const formData = new FormData();

  formData.append('concertId', data.concertId || '');
  if (data.seat) {
    formData.append('seat', JSON.stringify(data.seat));
  }
  formData.append('visibility', String(data.visibility || ''));
  formData.append('comfort', data.comfort || '');
  formData.append('sightLevel', data.sightLevel || '');
  formData.append('comment', data.comment || '');

  data.images.forEach((file, index) => {
    formData.append(`image${index + 1}`, file);
  });

  return formData;
};

export function SightReviewFormContainer() {
  const handleSubmit = async (formData: SightReviewFormData) => {
    try {
      console.log('Submit button clicked, submitting form data:', formData);

      const submitData = createFormDataWithFiles(formData);
      const response = await mockApiCall(submitData);

      console.log('Submit successful:', response);
      return response;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  return <SightReviewForm onSubmit={handleSubmit} />;
}
