import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface NavigationProps {
  isFirstStep: boolean
  isLastStep: boolean
  onPrevStep: () => void
  onNextStep: () => void
  canSubmit: boolean
  isSubmitting: boolean
}

export function Navigation({
  isFirstStep,
  isLastStep,
  onPrevStep,
  onNextStep,
  canSubmit,
  isSubmitting,
}: NavigationProps) {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={isFirstStep}
      >
        Anterior
      </Button>

      {isLastStep ? (
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
      ) : (
        <Button type="button" onClick={onNextStep}>
          Siguiente
        </Button>
      )}
    </div>
  )
}
