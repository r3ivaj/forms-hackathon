import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface NavigationProps {
  isFirstStep: boolean
  isLastStep: boolean
  onPrevStep: () => void
  onNextStep: () => void | Promise<void>
  canSubmit: boolean
  isSubmitting: boolean
  isTimerExpired?: boolean
  onSubmit: () => void | Promise<void>
}

export function Navigation({
  isFirstStep,
  isLastStep,
  onPrevStep,
  onNextStep,
  canSubmit,
  isSubmitting,
  isTimerExpired = false,
  onSubmit,
}: NavigationProps) {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={isFirstStep || isTimerExpired}
      >
        Anterior
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          disabled={!canSubmit || isSubmitting || isTimerExpired}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            'Enviando...'
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </>
          )}
        </Button>
      ) : (
        <Button type="button" onClick={onNextStep} disabled={isTimerExpired}>
          Siguiente
        </Button>
      )}
    </div>
  )
}
