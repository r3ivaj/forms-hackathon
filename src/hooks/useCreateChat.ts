import { useCallback } from 'react'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'

export function useCreateChat() {
  const createChatMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.createChat),
  })

  const createChat = useCallback(async () => {
    try {
      const newId = await createChatMutation.mutateAsync({})
      return newId
    } catch (error) {
      console.error('Error creating chat:', error)
      throw error
    }
  }, [createChatMutation])

  return {
    createChat,
    isCreating: createChatMutation.isPending,
  }
}
