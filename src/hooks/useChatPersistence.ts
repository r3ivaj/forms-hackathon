import { useState, useCallback, useEffect, useRef } from "react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "convex/_generated/api";

export function useChatPersistence() {
  const [chatId, setChatId] = useState<Id<"chats"> | null>(null);
  const chatIdRef = useRef<Id<"chats"> | null>(null);

  const createChatMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.createChat)
  });

  const updateMessagesMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.updateMessages)
  });

  // Keep ref in sync with state
  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  const ensureChat = useCallback(async () => {
    const currentChatId = chatIdRef.current;

    if (!currentChatId) {
      try {
        const newId = await createChatMutation.mutateAsync({});
        setChatId(newId);
        chatIdRef.current = newId;
        return newId;
      } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
      }
    }

    return currentChatId;
  }, [createChatMutation]);

  const persistMessages = useCallback(
    async (messages: any[]) => {
      const id = await ensureChat();
      await updateMessagesMutation.mutateAsync({ chatId: id, messages });
    },
    [ensureChat, updateMessagesMutation]
  );

  return {
    chatId,
    persistMessages,
  };
}
