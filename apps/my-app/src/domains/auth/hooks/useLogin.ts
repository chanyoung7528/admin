import { useMutation } from '@tanstack/react-query';

import { postAuthToken } from '../services/authService';
import { useAuthStore } from '../stores/useAuthStore';

export function useLogin() {
  const setTokens = useAuthStore(state => state.setTokens);

  const mutation = useMutation({
    mutationFn: postAuthToken,
    onSuccess: setTokens,
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
