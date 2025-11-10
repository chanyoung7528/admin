import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendReply } from "../services";

export function useSendReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

