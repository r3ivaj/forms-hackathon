import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'

export function useFormSettingsByShortId(shortId: string) {
  return useQuery(
    convexQuery(api.formSettings.getFormSettingsByShortId, { shortId })
  )
}
