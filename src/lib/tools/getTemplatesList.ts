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

// Account type schema for PM (Personas Morales) and PF (Personas Físicas)
const accountTypeSchema = z
  .enum(['PM', 'PF'])
  .describe(
    'Tipo de cuenta: PM para Personas Morales (empresas u organizaciones), PF para Personas Físicas (individuos)',
  )

export const getTemplatesList = tool({
  description: 'Get a list of templates',
  inputSchema: z.object({ accountType: accountTypeSchema }),
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
