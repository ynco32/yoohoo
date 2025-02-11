import { create } from 'zustand';
import { SightReviewFormData } from '@/types/sightReviews';

export type ValidFields =
  | 'concertId'
  | 'images'
  | 'viewScore'
  | 'seat'
  | 'seatDistance'
  | 'content';

interface ValidationState {
  concertId: boolean;
  images: boolean;
  viewScore: boolean;
  seat: boolean;
  seatDistance: boolean;
  content: boolean;
}

interface TouchedState {
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
  touched: TouchedState;
  setFormField: <K extends keyof SightReviewFormData>(
    field: K,
    value: SightReviewFormData[K]
  ) => void;
  setFormData: (data: SightReviewFormData) => void; // 새로 추가된 메서드
  setError: (field: string, error: string | undefined) => void;
  setValidation: (field: keyof ValidationState, isValid: boolean) => void;
  setTouched: (field: ValidFields) => void;
  clearErrors: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isFormValid: () => boolean;
}

const initialFormData: SightReviewFormData = {
  concertId: 0,
  section: 0,
  rowLine: 0,
  columnLine: 0,
  stageType: 0,
  images: [],
  viewScore: 0,
  seatDistance: '평범해요',
  sound: '평범해요',
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

const initialTouched: TouchedState = {
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
  touched: initialTouched,
  setFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  setFormData: (data) =>
    set({
      formData: data,
      // 폼 데이터가 새로 설정될 때 validation과 touched 상태도 초기화
      validation: initialValidation,
      touched: initialTouched,
      errors: {},
    }),
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
  setTouched: (field) =>
    set((state) => ({
      touched: {
        ...state.touched,
        [field]: true,
      },
    })),
  clearErrors: () => set({ errors: {} }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  isFormValid: () =>
    Object.values(get().validation).every((isValid) => isValid),
}));
