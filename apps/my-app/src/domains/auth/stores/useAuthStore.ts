import { create } from 'zustand';
import type { AuthTokens, AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string;
  refreshToken: string;
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthTokens) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  accessToken: '',
  refreshToken: '',
  setUser: user =>
    set(state => ({
      ...state,
      user,
    })),
  setTokens: tokens =>
    set(state => ({
      ...state,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })),
  reset: () =>
    set({
      user: null,
      accessToken: '',
      refreshToken: '',
    }),
}));
