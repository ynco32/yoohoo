// store/useSightReviewStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SightReviewFormData, FormErrors } from '@/types/sightReviews';

interface SightReviewState {
  formData: SightReviewFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  setFormField: <K extends keyof SightReviewFormData>(
    field: K,
    value: SightReviewFormData[K]
  ) => void;
  setError: (field: keyof FormErrors, error?: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
}

const initialFormData: SightReviewFormData = {
  section: 0,
  rowLine: 0,
  columnLine: 0,
  concertId: 0,
  content: '',
  images: [],
  viewScore: 0,
  seatDistance: '평범해요',
  sound: '보통',
};

export const useSightReviewStore = create<SightReviewState>()(
  devtools(
    (set) => ({
      formData: { ...initialFormData },
      errors: {},
      isSubmitting: false,

      setFormField: (field, value) =>
        set(
          (state) => ({
            formData: {
              ...state.formData,
              [field]: value,
            },
          }),
          false,
          'setFormField'
        ),

      setError: (field, error) =>
        set(
          (state) => ({
            errors: {
              ...state.errors,
              [field]: error,
            },
          }),
          false,
          'setError'
        ),

      setIsSubmitting: (isSubmitting) =>
        set(
          () => ({
            isSubmitting,
          }),
          false,
          'setIsSubmitting'
        ),

      resetForm: () =>
        set(
          () => ({
            formData: { ...initialFormData },
            errors: {},
            isSubmitting: false,
          }),
          false,
          'resetForm'
        ),
    }),
    { name: 'sight-review-store' }
  )
);
