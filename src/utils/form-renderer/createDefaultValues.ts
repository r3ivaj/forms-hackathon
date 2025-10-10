import { FormSchema } from '@/utils/schemas/formSchema'

// Create default values from form schema
export const createDefaultValues = (formSchema: FormSchema) => {
  const defaultValues: Record<string, any> = {}
  formSchema.steps.forEach((step: FormSchema['steps'][0]) => {
    step.fields.forEach((field: FormSchema['steps'][0]['fields'][0]) => {
      if (field.type === 'file') {
        defaultValues[field.id] = null
      } else {
        defaultValues[field.id] = ''
      }
    })
  })
  return defaultValues
}
