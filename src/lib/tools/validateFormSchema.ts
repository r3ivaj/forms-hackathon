import { tool } from 'ai'
import { z } from 'zod'

const fieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'textarea', 'select', 'file']),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(), // only if type is select
})

const stepSchema = z.object({
  id: z.string(),
  title: z.string(),
  fields: z.array(fieldSchema).min(1),
})

const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1),
})

export const validateFormSchema = tool({
  description: 'Validate a form schema',
  inputSchema: formSchema,
  execute: async (schema) => {
    console.log('executing validateFormSchema tool')
    const result = formSchema.safeParse(schema)

    if (!result.success) {
      return {
        isValid: false,
        issues: result.error.issues,
        schema: null,
      }
    }

    return {
      isValid: true,
      issues: [],
      schema: result.data,
    }
  },
})
