// Transform form schema to custom pages config format
export function transformFormSchemaToCustomPagesConfig(formSchema: any) {
  // Extract all fields from all steps
  const allFields =
    formSchema.steps?.flatMap(
      (step: any) =>
        step.fields?.map((field: any) => ({
          ...field,
          stepId: step.id,
          stepTitle: step.title,
        })) || [],
    ) || []

  const fields = allFields.map((field: any) => {
    const baseField = {
      label: field.label,
      slug: field.id, // Use field.id as slug
      component: mapFieldTypeToComponent(field.type),
      section: field.stepId, // Use stepId as section
      isRequired: field.validation?.required || false,
    }

    // Add component-specific config
    if (field.type === 'select' && field.options) {
      return {
        ...baseField,
        config: {
          options: field.options.map((option: string) => ({
            label: option,
            value: option,
          })),
        },
      }
    }

    if (
      field.type === 'text' ||
      field.type === 'email' ||
      field.type === 'tel'
    ) {
      return {
        ...baseField,
        config: {
          minLength: field.validation?.minLength || 0,
          maxLength: field.validation?.maxLength || 256,
        },
      }
    }

    if (field.type === 'textarea') {
      return {
        ...baseField,
        config: {
          minLength: field.validation?.minLength || 0,
          maxLength: field.validation?.maxLength || 256,
        },
      }
    }

    if (field.type === 'file') {
      return {
        ...baseField,
        config: {
          label: field.label,
          fileType: 'pdf', // Default to pdf, could be enhanced based on validation.extensions
        },
      }
    }

    if (field.type === 'number') {
      return {
        ...baseField,
        config: {
          min: field.validation?.min,
          max: field.validation?.max,
        },
      }
    }

    return baseField
  })

  // Create pages structure based on steps
  const pages = {
    beforeGeneralInformation: [],
    afterGeneralInformation:
      formSchema.steps?.map((step: any) => ({
        slug: step.id,
        name: step.title,
        submitButton: {
          label: 'Continuar',
        },
        descriptionPage: {
          label: step.title,
        },
        sections: [
          {
            slug: step.id,
            name: step.title,
            fields: step.fields?.map((field: any) => field.id) || [],
          },
        ],
      })) || [],
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
      return 'TextInput' // Numbers are typically handled as text inputs
    default:
      return 'TextInput'
  }
}
