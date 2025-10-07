import { Button } from '@/components/ui/button'
import { Timer } from 'lucide-react'

interface TimerStartScreenProps {
  duration: number
  onStart: () => void
}

export function TimerStartScreen({ duration, onStart }: TimerStartScreenProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 text-center">
      <div className="space-y-4">
        <Timer className="mx-auto h-12 w-12 text-muted-foreground" />

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Tiempo Limitado
          </h1>
          <p className="text-muted-foreground">
            Tienes {duration} minutos para completar este formulario
          </p>
        </div>

        <Button onClick={onStart} size="lg">
          Comenzar Formulario
        </Button>
      </div>
    </div>
  )
}
