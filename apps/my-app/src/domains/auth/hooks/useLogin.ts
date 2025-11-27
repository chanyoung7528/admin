import { useMutation } from '@tanstack/react-query';
import { issueSessionTokens } from '../services/authService';
import type { LoginPayload } from '../utils/types';

export function useLogin() {
  const mutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const tokens = await issueSessionTokens(payload);
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
  };
}
