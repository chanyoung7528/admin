import { useMutation } from "@tanstack/react-query";

export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: { userId: string; message: string }) => {
      // TODO: Implement API call
      return data;
    },
  });
}

