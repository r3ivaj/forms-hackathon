import { useCallback } from "react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function useMutateChatMessages({ id }: { id: Id<"chats"> }) {
  const updateChatMessagesMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.patchChatMessages)
  });

  const mutateChatMessages = useCallback(async (messages: string) => {
    try {
      const updated = await updateChatMessagesMutation.mutateAsync({
        chatId: id,
        messages,
      });
      return updated;
    } catch (error) {
      console.error('Error updating chat:', error);
      throw error;
    }
  }, [updateChatMessagesMutation]);

  return {
    mutateChatMessages,
    isUpdating: updateChatMessagesMutation.isPending,
  };
}
