interface StepProgressProps {
  currentStep: number
  totalSteps: number
  currentStepTitle: string
}

export function StepProgress({
  currentStep,
  totalSteps,
  currentStepTitle,
}: StepProgressProps) {
  return (
    <div className="space-y-2">
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>
          Paso {currentStep + 1} de {totalSteps}
        </span>
        <span>{currentStepTitle}</span>
      </div>
      <div className="bg-muted h-2 w-full rounded-full">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
