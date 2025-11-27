import { useMutation } from '@tanstack/react-query';
import { createAuthStoreAdapter, issueSessionTokens } from '../services/authService';
import { useAuthStore } from '../stores/useAuthStore';
import type { LoginPayload } from '../utils/types';

export function useLogin() {
  const authStore = createAuthStoreAdapter(useAuthStore);

  const mutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const tokens = await issueSessionTokens(payload, authStore);
      return tokens;
    },
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
