import { tool } from 'ai'
import { z } from 'zod'
import { templatesList } from '../templates/templatesList'

const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  accountType: z.enum(['PM', 'PF']),
})

export type Template = z.infer<typeof templateSchema>

export const getTemplatesList = tool({
  description: 'Get a list of templates',
  inputSchema: z.object({ accountType: z.enum(['PM', 'PF']).optional() }),
  execute: async ({
    accountType,
  }: {
    accountType?: 'PM' | 'PF'
  }): Promise<{ templates: Omit<Template, 'accountType'>[] }> => {
    return {
      templates: templatesList
        .filter((template) => template.accountType === accountType)
        .map((template) => ({
          id: template.id,
          name: template.name,
          description: template.description,
        })),
    }
  },
})
