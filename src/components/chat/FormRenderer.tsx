import { FormSchema } from '@/lib/tools/validateFormSchema'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { validateField, FieldValidation } from '@/utils/chat/validationUtils'
import { TextInput } from './form-components/TextInput'
import { TextArea } from './form-components/TextArea'
import { SelectField } from './form-components/SelectField'
import { FileInput } from './form-components/FileInput'

// Create default values from form schema
const createDefaultValues = (formSchema: FormSchema) => {
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

export function FormRenderer({ formSchema }: { formSchema: FormSchema }) {
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm({
    defaultValues: createDefaultValues(formSchema),
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log('Form submitted with values:', value)
    },
  })

  const handleNextStepClick = async () => {
    let isStepValid = true
    for (const field of formSchema.steps[currentStep].fields) {
      const validationResult = await form.validateField(field.id, 'submit')
      if (validationResult.length > 0) {
        isStepValid = false
      }
    }

    if (isStepValid && currentStep < formSchema.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStepClick = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderField = (field: {
    id: string
    label: string
    type: 'text' | 'email' | 'textarea' | 'select' | 'file' | 'number'
    validation?: FieldValidation
    options?: string[]
  }) => {
    const { id, label, type, validation, options } = field
    const required = validation?.required || false

    return (
      <form.Field
        key={id}
        name={id}
        validators={{
          onChange: ({ value }) => {
            const validationResult = validateField(
              value,
              type,
              validation,
              label,
            )
            return validationResult.isValid
              ? undefined
              : validationResult.errorMessage
          },
        }}
        children={(fieldApi) => {
          const { handleChange, handleBlur } = fieldApi
          const { value } = fieldApi.state
          const { errors } = fieldApi.state.meta

          switch (type) {
            case 'text':
            case 'email':
            case 'number':
              return (
                <TextInput
                  id={id}
                  label={label}
                  type={type}
                  value={value || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  validation={validation}
                  required={required}
                  errors={(errors as string[]) || []}
                />
              )

            case 'textarea':
              return (
                <TextArea
                  id={id}
                  label={label}
                  value={value || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  validation={validation}
                  required={required}
                  errors={(errors as string[]) || []}
                />
              )

            case 'select':
              return (
                <SelectField
                  id={id}
                  label={label}
                  value={value || ''}
                  onChange={handleChange}
                  options={options}
                  required={required}
                  errors={(errors as string[]) || []}
                />
              )

            case 'file':
              return (
                <FileInput
                  id={id}
                  label={label}
                  onChange={handleChange}
                  validation={validation}
                  required={required}
                  errors={(errors as string[]) || []}
                />
              )

            default:
              return null
          }
        }}
      />
    )
  }

  const currentStepData = formSchema.steps[currentStep]
  const isLastStep = currentStep === formSchema.steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        {/* Form Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{formSchema.title}</h1>
          {formSchema.description && (
            <p className="text-muted-foreground">{formSchema.description}</p>
          )}
        </div>

        {/* Step Progress */}
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span>
              Paso {currentStep + 1} de {formSchema.steps.length}
            </span>
            <span>{currentStepData.title}</span>
          </div>
          <div className="bg-muted h-2 w-full rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / formSchema.steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Render all steps, but only show the current step */}
        {formSchema.steps.map((step, idx) => (
          <div
            key={step.id}
            className={`space-y-6 ${idx === currentStep ? '' : 'hidden'}`}
          >
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <div className="space-y-4">{step.fields.map(renderField)}</div>
          </div>
        ))}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStepClick}
            disabled={isFirstStep}
          >
            Anterior
          </Button>

          {isLastStep ? (
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>
              )}
            />
          ) : (
            <Button type="button" onClick={handleNextStepClick}>
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
