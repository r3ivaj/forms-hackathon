import { FormSchema } from '@/lib/tools/validateFormSchema'
import { useState, useEffect, useRef } from 'react'
import { useForm } from '@tanstack/react-form'
import { validateField, FieldValidation } from '@/utils/chat/validationUtils'
import { StepProgress } from './StepProgress'
import { FormHeader } from './FormHeader'
import { Navigation } from './Navigation'
import { FieldSelector } from './FieldSelector'
import { createDefaultValues } from '@/utils/form-renderer/createDefaultValues'
import { TimerStartScreen } from './TimerStartScreen'
import { TimerDisplay } from './TimerDisplay'
import { useTimer } from '@/hooks/useTimer'
import { isEqual } from 'es-toolkit'

export function FormRenderer({ formSchema }: { formSchema: FormSchema }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const previousSchemaRef = useRef<FormSchema | null>(null)

  // Check if form has custom duration
  const hasCustomDuration = formSchema.sessionDuration.type === 'custom'
  const durationMinutes = formSchema.sessionDuration.type === 'custom' ? formSchema.sessionDuration.customMinutes : 0

  // Timer logic
  const timer = useTimer({ durationMinutes })

  const form = useForm({
    defaultValues: createDefaultValues(formSchema),
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log('Form submitted with values:', value)
    },
  })

  // Reset form when schema actually changes
  useEffect(() => {
    const previousSchema = previousSchemaRef.current

    // Only reset if schema has actually changed (not just if it's different from published)
    if (previousSchema && !isEqual(previousSchema, formSchema)) {
      // Reset form state
      setCurrentStep(0)
      setHasStarted(false)

      // Reset form values
      form.reset()

      // Reset timer
      timer.reset()
    }

    // Update the ref with current schema
    previousSchemaRef.current = formSchema
  }, [formSchema, form, timer])

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

  const handleStartTimer = () => {
    setHasStarted(true)
    timer.start()
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

          return (
            <FieldSelector
              id={id}
              label={label}
              type={type}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              validation={validation}
              required={required}
              errors={(errors as string[]) || []}
              options={options}
            />
          )
        }}
      />
    )
  }

  const currentStepData = formSchema.steps[currentStep]
  const isLastStep = currentStep === formSchema.steps.length - 1
  const isFirstStep = currentStep === 0

  // Show timer start screen if custom duration and not started
  if (hasCustomDuration && !hasStarted) {
    return (
      <TimerStartScreen
        duration={durationMinutes}
        onStart={handleStartTimer}
      />
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        // Block submission if timer has expired
        if (hasCustomDuration && timer.isExpired) {
          return
        }
        form.handleSubmit()
      }}
    >
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        {/* Timer Display */}
        {hasCustomDuration && (
          <TimerDisplay
            timeLeft={timer.timeLeft}
            isExpired={timer.isExpired}
            formatTime={timer.formatTime}
          />
        )}

        {/* Form Header */}
        <FormHeader
          title={formSchema.title}
          description={formSchema.description}
        />

        {/* Step Progress */}
        <StepProgress
          currentStep={currentStep}
          totalSteps={formSchema.steps.length}
          currentStepTitle={currentStepData.title}
        />

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
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Navigation
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              onPrevStep={handlePrevStepClick}
              onNextStep={handleNextStepClick}
              canSubmit={canSubmit && !(hasCustomDuration && timer.isExpired)}
              isSubmitting={isSubmitting}
              isTimerExpired={hasCustomDuration && timer.isExpired}
            />
          )}
        />
      </div>
    </form>
  )
}
