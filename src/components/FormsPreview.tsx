import { EmptySection } from '@/components/EmptySection'
import { Box } from 'lucide-react'
import { FormRenderer } from './FormRenderer'
import { FormSchema } from '@/lib/tools/validateFormSchema'

export function FormsPreview({
  formSchema,
}: {
  formSchema: FormSchema | null
}) {
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
