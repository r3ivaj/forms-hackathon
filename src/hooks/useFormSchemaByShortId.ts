import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'

export function useFormSchemaByShortId(shortId: string) {
  return useQuery(
    convexQuery(api.chats.getFormSchemaByShortId, { shortId })
  )
}
