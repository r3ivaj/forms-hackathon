import { useCallback } from "react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function useMutateFormOptions() {
  const formOptionsMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.patchFormOptions)
  });

  const mutateFormOptions = useCallback(async (params: {
    chatId: Id<"chats">;
    slug: string;
    sessionDuration: "unlimited" | "custom";
    customDuration?: number;
    nipValidation: boolean;
  }) => {
    try {
      const updated = await formOptionsMutation.mutateAsync(params);
      return updated;
    } catch (error) {
      console.error('Error patching form options:', error);
      throw error;
    }
  }, [formOptionsMutation]);

  return {
    mutateFormOptions,
    isUpdating: formOptionsMutation.isPending,
  };
}
