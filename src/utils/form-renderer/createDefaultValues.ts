import { FormSchema } from '@/lib/tools/validateFormSchema'

// Create default values from form schema
export const createDefaultValues = (formSchema: FormSchema) => {
  const defaultValues: Record<string, any> = {}
  formSchema.steps.forEach((step) => {
    step.fields.forEach((field) => {
      if (field.type === 'file') {
        defaultValues[field.id] = null
      } else {
        defaultValues[field.id] = ''
      }
    })
  })
  return defaultValues
}
