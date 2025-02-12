import { create } from 'zustand';
import { SightReviewFormData } from '@/types/sightReviews';

export type ValidFields =
  | 'concertId'
  | 'photo' // images -> photo로 변경
  | 'viewScore'
  | 'seat'
  | 'seatDistance'
  | 'content';

interface ValidationState {
  concertId: boolean;
  photo: boolean; // images -> photo로 변경
  viewScore: boolean;
  seat: boolean;
  seatDistance: boolean;
  content: boolean;
}

interface TouchedState {
  concertId: boolean;
  photo: boolean; // images -> photo로 변경
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
  setFormData: (data: SightReviewFormData) => void;
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
  photo: null, // images 배열 대신 photo: null
  viewScore: 0,
  seatDistance: '평범해요',
  sound: '평범해요',
  content: '',
};

const initialValidation: ValidationState = {
  concertId: false,
  photo: false, // images -> photo로 변경
  viewScore: false,
  seat: false,
  seatDistance: false,
  content: false,
};

const initialTouched: TouchedState = {
  concertId: false,
  photo: false, // images -> photo로 변경
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
  setFormData: (data) => {
    console.log('=== Setting Form Data ===');
    console.log('Received data:', data);

    const initialValidationState = {
      concertId: data.concertId > 0,
      photo: data.photo instanceof File || typeof data.photo === 'string',
      viewScore: data.viewScore > 0,
      seat: data.section > 0 && data.rowLine > 0 && data.columnLine > 0,
      seatDistance: data.seatDistance.length > 0,
      content: data.content.length >= 10,
    };

    console.log('=== Validation Checks ===');
    console.log(
      'photo check:',
      data.photo instanceof File || typeof data.photo === 'string'
    );
    console.log('seat check:', {
      section: data.section > 0,
      rowLine: data.rowLine > 0,
      columnLine: data.columnLine > 0,
      final: data.section > 0 && data.rowLine > 0 && data.columnLine > 0,
    });

    set({
      formData: data,
      validation: initialValidationState,
      touched: initialTouched,
      errors: {},
    });
  },
  setError: (field, error) =>
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: error,
      },
    })),
  setValidation: (field, isValid) => {
    console.log(`Setting validation for ${field}:`, isValid);
    set((state) => {
      const newValidation = {
        ...state.validation,
        [field]: isValid,
      };
      console.log('Updated validation state:', newValidation);
      return { validation: newValidation };
    });
  },
  setTouched: (field) =>
    set((state) => ({
      touched: {
        ...state.touched,
        [field]: true,
      },
    })),
  clearErrors: () => set({ errors: {} }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  isFormValid: () => {
    const validationState = get().validation;
    console.log('=== Validation State ===');
    console.log('concertId:', validationState.concertId);
    console.log('photo:', validationState.photo);
    console.log('viewScore:', validationState.viewScore);
    console.log('seat:', validationState.seat);
    console.log('seatDistance:', validationState.seatDistance);
    console.log('content:', validationState.content);

    const isValid = Object.values(validationState).every((isValid) => isValid);
    console.log('Final validation result:', isValid);
    return isValid;
  },
}));
