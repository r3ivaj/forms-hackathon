import { useCallback } from "react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function useMutateFormOptions() {
  return useMutation({
    mutationFn: useConvexMutation(api.chats.patchFormOptions)
  });
}
