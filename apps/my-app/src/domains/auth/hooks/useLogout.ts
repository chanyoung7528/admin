import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * 로그아웃 훅
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore(state => state.clearAuth);

  const logout = useCallback(() => {
    clearAuth();
    navigate({ to: '/' });
  }, [clearAuth, navigate]);

  return { logout };
};
