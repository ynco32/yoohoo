import { create } from 'zustand';

interface SecurityPopupStoreProps {
  onSuccess: boolean;
  setSecurityPopupState: (onPostpone: boolean) => void;
  reset: () => void;
}

export const useSecurityPopupStore = create<SecurityPopupStoreProps>((set) => ({
  onPostpone: false,
  onSuccess: false,
  setSecurityPopupState: (onSuccess: boolean) => set({ onSuccess }),

  reset: () => set({ onSuccess: false }),
}));
