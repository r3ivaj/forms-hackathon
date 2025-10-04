import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'

export function useFormSettings(chatId: string) {
  return useQuery(
    convexQuery(api.chats.getFormSettings, { chatId: chatId as Id<"chats"> })
  )
}
