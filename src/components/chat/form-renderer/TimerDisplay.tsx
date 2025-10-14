import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Clock, AlertTriangle } from 'lucide-react'

interface TimerDisplayProps {
  timeLeft: number
  isExpired: boolean
  formatTime: (seconds: number) => string
}

export function TimerDisplay({
  timeLeft,
  isExpired,
  formatTime,
}: TimerDisplayProps) {
  if (isExpired) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Tiempo agotado</AlertTitle>
        <AlertDescription>
          El tiempo se ha agotado. No puedes continuar con el formulario.
        </AlertDescription>
      </Alert>
    )
  }

  const isLowTime = timeLeft <= 60 // Less than 1 minute
  const isCriticalTime = timeLeft <= 30 // Less than 30 seconds

  if (isCriticalTime) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Tiempo crítico - {formatTime(timeLeft)}</AlertTitle>
        <AlertDescription>
          El tiempo se está agotando. Completa el formulario rápidamente.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLowTime) {
    return (
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Tiempo bajo - {formatTime(timeLeft)}</AlertTitle>
        <AlertDescription>
          Te queda poco tiempo para completar el formulario.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-6">
      <Clock className="h-4 w-4" />
      <AlertTitle>Tiempo restante - {formatTime(timeLeft)}</AlertTitle>
      <AlertDescription>
        Completa el formulario dentro del tiempo establecido.
      </AlertDescription>
    </Alert>
  )
}
