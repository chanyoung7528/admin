import { create } from 'zustand';

const ACCESS_TOKEN_KEY = 'access_token';

export interface AuthUser {
  accountNo: string;
  email: string;
  role: string[];
  exp: number;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setTokens: (accessToken: string) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,

  setTokens: async (accessToken: string) => {
    if (window.cookieStore) {
      await window.cookieStore.set(ACCESS_TOKEN_KEY, accessToken);
    }
    set({ accessToken, isAuthenticated: true });
  },

  setUser: user => {
    set({ user });
  },

  signOut: async () => {
    if (window.cookieStore) {
      await window.cookieStore.delete(ACCESS_TOKEN_KEY);
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      if (window.cookieStore) {
        const cookie = await window.cookieStore.get(ACCESS_TOKEN_KEY);
        if (cookie) {
          set({ accessToken: cookie.value, isAuthenticated: true });
        } else {
          set({ accessToken: null, isAuthenticated: false, user: null });
        }
      }
    } catch (error) {
      console.error('Failed to check auth cookie:', error);
      set({ accessToken: null, isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
