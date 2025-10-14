import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'

export function useChat(chatId: Id<'chats'>) {
  const {
    data: chat,
    isPending,
    isLoading,
    error,
  } = useQuery(convexQuery(api.chats.getChat, { chatId }))

  return {
    chat,
    isPending,
    isLoading,
    error,
  }
}
