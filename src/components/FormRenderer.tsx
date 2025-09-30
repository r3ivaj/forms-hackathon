import { FormSchema } from '@/lib/tools/validateFormSchema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { useForm } from '@tanstack/react-form'

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
    type: 'text' | 'textarea' | 'select' | 'file' | 'number'
    validation?: {
      required?: boolean
      minLength?: number
      maxLength?: number
      regex?: string
      email?: boolean
      min?: number
      max?: number
      maxSize?: number
      extensions?: string[]
    }
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
            // Required validation
            if (
              validation?.required &&
              (!value || (typeof value === 'string' && value.trim() === ''))
            ) {
              return `${label} es requerido`
            }

            // Skip other validations if value is empty and not required
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              return undefined
            }

            const stringValue = String(value)

            // Text/Textarea validations
            if (type === 'text' || type === 'textarea') {
              // Min length validation
              if (
                validation?.minLength &&
                stringValue.length < validation.minLength
              ) {
                return `${label} debe tener al menos ${validation.minLength} caracteres`
              }

              // Max length validation
              if (
                validation?.maxLength &&
                stringValue.length > validation.maxLength
              ) {
                return `${label} no puede tener más de ${validation.maxLength} caracteres`
              }

              // Email validation
              if (validation?.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(stringValue)) {
                  return `${label} debe ser un email válido`
                }
              }

              // Regex validation
              if (validation?.regex) {
                try {
                  const regex = new RegExp(validation.regex)
                  if (!regex.test(stringValue)) {
                    return `${label} no cumple con el formato requerido`
                  }
                } catch (error) {
                  console.error('Invalid regex pattern:', validation.regex)
                }
              }
            }

            // Number validations
            if (type === 'number') {
              const numValue = Number(value)
              if (isNaN(numValue)) {
                return `${label} debe ser un número válido`
              }

              if (validation?.min !== undefined && numValue < validation.min) {
                return `${label} debe ser mayor o igual a ${validation.min}`
              }

              if (validation?.max !== undefined && numValue > validation.max) {
                return `${label} debe ser menor o igual a ${validation.max}`
              }
            }

            // File validations
            if (type === 'file' && value instanceof File) {
              // Max size validation (in KB)
              if (
                validation?.maxSize &&
                value.size > validation.maxSize * 1024
              ) {
                return `${label} no puede ser mayor a ${validation.maxSize} KB`
              }

              // File extension validation
              if (validation?.extensions && validation.extensions.length > 0) {
                const fileExtension = value.name.split('.').pop()?.toLowerCase()
                if (
                  !fileExtension ||
                  !validation.extensions.includes(fileExtension)
                ) {
                  return `${label} debe ser uno de los siguientes tipos: ${validation.extensions.join(', ')}`
                }
              }
            }

            return undefined
          },
        }}
        children={(fieldApi) => {
          const { handleChange, handleBlur } = fieldApi
          const { value } = fieldApi.state
          const { errors } = fieldApi.state.meta

          switch (type) {
            case 'text':
            case 'number':
              return (
                <div className="space-y-2">
                  <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={id}
                    type={type}
                    value={value || ''}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Ingresa ${label.toLowerCase()}`}
                    min={type === 'number' ? validation?.min : undefined}
                    max={type === 'number' ? validation?.max : undefined}
                    minLength={
                      type === 'text' ? validation?.minLength : undefined
                    }
                    maxLength={
                      type === 'text' ? validation?.maxLength : undefined
                    }
                  />
                  {errors && errors.length > 0 && (
                    <p className="text-sm text-red-500">{errors[0]}</p>
                  )}
                </div>
              )

            case 'textarea':
              return (
                <div className="space-y-2">
                  <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </Label>
                  <Textarea
                    id={id}
                    value={value || ''}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Ingresa ${label.toLowerCase()}`}
                    rows={4}
                    minLength={validation?.minLength}
                    maxLength={validation?.maxLength}
                  />
                  {errors && errors.length > 0 && (
                    <p className="text-sm text-red-500">{errors[0]}</p>
                  )}
                </div>
              )

            case 'select':
              return (
                <div className="space-y-2">
                  <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </Label>
                  <Select value={value || ''} onValueChange={handleChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`Selecciona ${label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors && errors.length > 0 && (
                    <p className="text-sm text-red-500">{errors[0]}</p>
                  )}
                </div>
              )

            case 'file':
              return (
                <div className="space-y-2">
                  <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={id}
                    type="file"
                    accept={
                      validation?.extensions
                        ? validation.extensions
                            .map((ext) => `.${ext}`)
                            .join(',')
                        : undefined
                    }
                    onChange={(e) =>
                      handleChange(
                        e.target.files && e.target.files.length > 0
                          ? e.target.files[0]
                          : null,
                      )
                    }
                  />
                  {errors && errors.length > 0 && (
                    <p className="text-sm text-red-500">{errors[0]}</p>
                  )}
                </div>
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
