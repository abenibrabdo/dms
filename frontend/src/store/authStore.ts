import { create } from 'zustand';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  department?: string;
  roles: string[];
  permissions: string[];
  initials: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (payload: { user: UserProfile; accessToken: string; refreshToken: string }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setSession: ({ user, accessToken, refreshToken }) =>
    set({
      user,
      accessToken,
      refreshToken,
    }),
  clearSession: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    }),
}));

