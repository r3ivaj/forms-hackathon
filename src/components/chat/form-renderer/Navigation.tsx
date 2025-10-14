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
}

export function Navigation({
  isFirstStep,
  isLastStep,
  onPrevStep,
  onNextStep,
  canSubmit,
  isSubmitting,
  isTimerExpired = false,
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
          type="submit"
          disabled={!canSubmit || isSubmitting || isTimerExpired}
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
