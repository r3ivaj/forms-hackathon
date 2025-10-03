import { EmptySection } from '@/components/EmptySection'
import { Box } from 'lucide-react'
import { FormRenderer } from './FormRenderer'
import { FormToolbar } from './FormToolbar'
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
    <div className="flex h-full flex-col">
      <FormToolbar />
      <div className="flex-1 overflow-y-auto p-4">
        <FormRenderer formSchema={formSchema} />
      </div>
    </div>
  )
}
