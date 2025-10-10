import { tool } from 'ai'
import { z } from 'zod'
import { templateFormSchemas } from '../templates/templateFormSchemas'
import { FormSchema } from '@/utils/schemas/formSchema'

export const getSchemaFromTemplate = tool({
  description: 'Get a form schema from a template',
  inputSchema: z.object({
    templateId: z.string(),
  }),
  execute: async ({
    templateId,
  }: {
    templateId: string
  }): Promise<{ formSchema: FormSchema }> => {
    const formSchema = templateFormSchemas[templateId]
    if (!formSchema) {
      throw new Error(`Template with id ${templateId} not found`)
    }

    return {
      formSchema,
    }
  },
})
