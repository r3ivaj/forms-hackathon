import { tool } from 'ai'
import { z } from 'zod'
import { templatesList } from '../templates/templatesList'

const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
})

export type Template = z.infer<typeof templateSchema>

export const getTemplatesList = tool({
  description: 'Get a list of templates',
  inputSchema: z.object({}),
  execute: async (): Promise<{ templates: Template[] }> => {
    return {
      templates: templatesList.map((template) => ({
        id: template.id,
        name: template.name,
        description: template.description,
      })),
    }
  },
})
