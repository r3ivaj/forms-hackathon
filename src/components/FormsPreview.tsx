import { EmptySection } from '@/components/EmptySection'
import { Box } from 'lucide-react'
import { FormRenderer } from './FormRenderer'

export function FormsPreview({ formSchema }: { formSchema: any }) {
  if (!formSchema) {
    return (
      <EmptySection
        title="No hay algún formulario para mostrar"
        description="Chatea con el asistente para crear uno"
        icon={Box}
      />
    )
  }

  return (
    <div>
      <FormRenderer formSchema={formSchema} />
    </div>
  )
}
