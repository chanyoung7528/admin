import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore(state => state.clearAuth);

  const logout = useCallback(() => {
    clearAuth();
    navigate({ to: '/login' });
  }, [clearAuth, navigate]);

  return { logout };
}
