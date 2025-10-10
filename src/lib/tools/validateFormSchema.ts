import { tool } from 'ai'
import { formSchema, type FormSchema } from '@/utils/schemas/formSchema'

export type { FormSchema }

export const validateFormSchema = tool({
  description: 'Validate a form schema',
  inputSchema: formSchema,
  execute: async (schema: FormSchema) => {
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
