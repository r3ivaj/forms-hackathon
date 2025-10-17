import { CheckCircle, Loader2, XCircle } from 'lucide-react'

interface FormSubmissionLoadingProps {
  message?: string
}

export function FormSubmissionLoading({
  message = 'Enviando...',
}: FormSubmissionLoadingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-4 w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          {/* Animated loading icon */}
          <div className="relative">
            <div className="border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
          </div>

          {/* Main content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-800">{message}</h2>
            <p className="max-w-xs text-sm text-slate-500">
              Procesando tu solicitud, por favor espera...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormSubmissionSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-4 w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          {/* Success icon */}
          <div className="bg-muted rounded-full p-6">
            <CheckCircle className="text-primary h-8 w-8" />
          </div>

          {/* Main content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-800">¡Enviado!</h2>
            <p className="max-w-xs text-sm text-slate-500">
              Las respuestas han sido enviadas correctamente
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormSubmissionError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-4 w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          {/* Error icon */}
          <div className="bg-muted rounded-full p-6">
            <XCircle className="text-destructive h-8 w-8" />
          </div>

          {/* Main content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-800">Error</h2>
            <p className="max-w-xs text-sm text-slate-500">
              No se pudo enviar el formulario, intenta de nuevo
            </p>
          </div>

          {/* Retry indicator */}
          <div className="flex items-center space-x-1 text-red-500">
            <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
