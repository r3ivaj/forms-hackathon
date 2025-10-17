import { PREDEFINED_FIELD_IDS } from '../constants'
import { FormSchema } from '@/utils/schemas/formSchema'

// Transform form schema to custom pages config format
export function transformFormSchemaToCustomPagesConfig(formSchema: FormSchema) {
  // Extract all fields from all steps, excluding predefined field IDs
  const allFields =
    formSchema.steps?.flatMap(
      (step) =>
        step.fields?.filter(
          (field) => !PREDEFINED_FIELD_IDS.includes(field.id),
        ) || [],
    ) || []

  // Transform fields to the desired structure
  const fields = allFields.map((field) => {
    const baseField = {
      label: field.label,
      slug: field.id,
      component: mapFieldTypeToComponent(field.type),
      section: 'testsection', // Single section as requested
      isRequired: field.validation?.required || false,
    }

    // Add component-specific config based on field type
    switch (field.type) {
      case 'select':
        return {
          ...baseField,
          config: {
            options:
              field.options?.map((option) => ({
                label: option.label,
                value: option.value,
              })) || [],
          },
        }

      case 'text':
      case 'email':
      case 'tel':
        return {
          ...baseField,
          config: {
            minLength: 0,
            maxLength: 20000,
          },
        }

      case 'textarea':
        return {
          ...baseField,
          config: {
            minLength: 0,
            maxLength: 20000,
          },
        }

      case 'file':
        return {
          ...baseField,
          config: {
            label: field.label,
            fileType: field.validation?.extensions?.[0] || 'pdf',
          },
        }

      case 'number':
        return {
          ...baseField,
          config: {
            min: field.validation?.min,
            max: field.validation?.max,
          },
        }

      default:
        return baseField
    }
  })

  // Create simplified pages structure (single page, single section)
  const pages = {
    beforeGeneralInformation: [],
    afterGeneralInformation: [
      {
        slug: 'testpage',
        name: 'testPage',
        submitButton: {
          label: 'Continuar',
        },
        descriptionPage: {
          label: 'testPage',
        },
        sections: [
          {
            slug: 'testsection',
            name: 'testSection',
            fields: fields.map((field) => field.slug),
          },
        ],
      },
    ],
  }

  return {
    fields,
    pages,
  }
}

// Map field types to Moffin components
export function mapFieldTypeToComponent(fieldType: string): string {
  switch (fieldType) {
    case 'text':
    case 'email':
    case 'tel':
      return 'TextInput'
    case 'textarea':
      return 'TextArea'
    case 'file':
      return 'File'
    case 'select':
      return 'Select'
    case 'number':
      return 'TextInput'
    default:
      return 'TextInput'
  }
}
