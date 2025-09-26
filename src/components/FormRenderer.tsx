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

export function FormRenderer({ formSchema }: { formSchema: FormSchema }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const nextStep = () => {
    if (currentStep < formSchema.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
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
    const value = formData[id] || ''

    switch (type) {
      case 'text':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              placeholder={`Ingresa ${label.toLowerCase()}`}
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={id}
              value={value}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              placeholder={`Ingresa ${label.toLowerCase()}`}
              rows={4}
            />
          </div>
        )

      case 'select':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleFieldChange(id, newValue)}
            >
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
          </div>
        )

      case 'file':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              type="file"
              onChange={(e) => handleFieldChange(id, e.target.files?.[0])}
            />
          </div>
        )

      default:
        return null
    }
  }

  const currentStepData = formSchema.steps[currentStep]
  const isLastStep = currentStep === formSchema.steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* <pre className="bg-muted overflow-x-auto rounded p-4 text-xs">
        {JSON.stringify(formSchema, null, 2)}
      </pre> */}
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

      {/* Current Step Content */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
        <div className="space-y-4">
          {currentStepData.fields.map(renderField)}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={isFirstStep}>
          Anterior
        </Button>

        <Button onClick={nextStep}>
          {isLastStep && <Send />}
          {isLastStep ? 'Enviar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  )
}
