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
    type: 'text' | 'textarea' | 'select' | 'file'
    required?: boolean
    options?: string[]
  }) => {
    const { id, label, type, required, options } = field

    return (
      <form.Field
        key={id}
        name={id}
        validators={{
          onChange: required
            ? ({ value }) => {
                if (
                  !value ||
                  (typeof value === 'string' && value.trim() === '')
                ) {
                  return `${label} es requerido`
                }
                return undefined
              }
            : undefined,
        }}
        children={(fieldApi) => {
          const { handleChange, handleBlur } = fieldApi
          const { value } = fieldApi.state
          const { errors } = fieldApi.state.meta

          switch (type) {
            case 'text':
              return (
                <div className="space-y-2">
                  <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={id}
                    type="text"
                    value={value || ''}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Ingresa ${label.toLowerCase()}`}
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
