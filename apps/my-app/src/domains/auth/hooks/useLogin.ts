import { useMutation } from '@tanstack/react-query';
import { postAuthToken } from '../services/authService';
import { useAuthStore } from '../stores/useAuthStore';
import type { LoginPayload } from '../utils/types';

export function useLogin() {
  const { setTokens } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await postAuthToken(payload);
      return response;
    },
    onSuccess: data => {
      if (data.result) {
        setTokens(data.result);
      }
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
