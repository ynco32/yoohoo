import { create } from 'zustand';

interface UserData {
  userId: number;
  nickname: string;
  email: string;
  userName: string;
  level: string | null;
  tier: string | null;
  profileUrl: string | null;
}

interface UserStore {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  fetchUserInfo: () => Promise<void>;
  setUser: (user: UserData | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUserInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/v1/main/user-info');
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const userData = await response.json();
      set({ user: userData, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An error occurred',
        isLoading: false,
      });
    }
  },

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, error: null }),
}));
