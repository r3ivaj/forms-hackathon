import { motion } from 'framer-motion'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface FormStateProps {
  title: string
  description: string
  icon: React.ReactNode
}

function FormStateBase({ title, description, icon }: FormStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-4 w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            {icon}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

export function FormSubmissionLoading({ message = 'Enviando...' }) {
  return (
    <FormStateBase
      title={message}
      description="Procesando tu solicitud, por favor espera..."
      icon={
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 className="text-muted-foreground h-10 w-10" />
        </motion.div>
      }
    />
  )
}

export function FormSubmissionSuccess() {
  return (
    <FormStateBase
      title="¡Formulario enviado!"
      description="Tus respuestas se han guardado correctamente."
      icon={
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <CheckCircle className="text-primary h-10 w-10" />
        </motion.div>
      }
    />
  )
}

export function FormSubmissionError() {
  return (
    <FormStateBase
      title="Ocurrió un error"
      description="No se pudo enviar el formulario. Intenta nuevamente."
      icon={
        <motion.div
          initial={{ rotate: -15, scale: 0.9 }}
          animate={{ rotate: [0, -10, 10, -5, 0], scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <XCircle className="text-destructive h-10 w-10" />
        </motion.div>
      }
    />
  )
}
