import type { AuthTokens } from '@repo/core/api';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      ...initialState,

      setTokens: ({ accessToken, refreshToken }) => {
        set({ accessToken, refreshToken, isAuthenticated: Boolean(accessToken) });
      },

      setUser: user => {
        set({ user });
      },

      clearAuth: () => {
        set({ ...initialState });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
