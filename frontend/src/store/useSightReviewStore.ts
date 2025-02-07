import { create } from 'zustand';
import { SightReviewFormData } from '@/types/sightReviews';

interface ValidationState {
  concertId: boolean;
  images: boolean;
  viewScore: boolean;
  seat: boolean;
  seatDistance: boolean;
  content: boolean;
}

interface SightReviewState {
  formData: SightReviewFormData;
  errors: Record<string, string | undefined>;
  isSubmitting: boolean;
  validation: ValidationState;
  setFormField: <K extends keyof SightReviewFormData>(
    field: K,
    value: SightReviewFormData[K]
  ) => void;
  setError: (field: string, error: string | undefined) => void;
  setValidation: (field: keyof ValidationState, isValid: boolean) => void;
  clearErrors: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isFormValid: () => boolean;
}

const initialFormData: SightReviewFormData = {
  concertId: 0,
  section: 0,
  rowLine: 0,
  columnLine: 0,
  images: [],
  viewScore: 0,
  seatDistance: '평범해요',
  sound: '보통',
  content: '',
};

const initialValidation: ValidationState = {
  concertId: false,
  images: false,
  viewScore: false,
  seat: false,
  seatDistance: false,
  content: false,
};

export const useSightReviewStore = create<SightReviewState>((set, get) => ({
  formData: initialFormData,
  errors: {},
  isSubmitting: false,
  validation: initialValidation,
  setFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  setError: (field, error) =>
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: error,
      },
    })),
  setValidation: (field, isValid) =>
    set((state) => ({
      validation: {
        ...state.validation,
        [field]: isValid,
      },
    })),
  clearErrors: () => set({ errors: {} }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  isFormValid: () =>
    Object.values(get().validation).every((isValid) => isValid),
}));
