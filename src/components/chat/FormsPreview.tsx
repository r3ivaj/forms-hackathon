import { EmptySection } from '@/components/EmptySection'
import { Box } from 'lucide-react'
import { FormRenderer } from './form-renderer/FormRenderer'
import { FormToolbar } from './FormToolbar'
import { FormSchema } from '@/lib/tools/validateFormSchema'
import { isEqual } from 'es-toolkit';
import { useMemo } from 'react'

export function FormsPreview({
  latestFormSchema,
  publishedFormSchema,
}: {
  latestFormSchema: FormSchema | null
  publishedFormSchema: FormSchema | null
}) {

  if (!latestFormSchema) {
    return (
      <EmptySection
        title="No hay algún formulario para mostrar"
        description="Chatea con el asistente para crear uno"
        icon={Box}
      />
    )
  }

  const isSchemaDifferent = useMemo(() => {
    return !isEqual(publishedFormSchema, latestFormSchema)
  }, [publishedFormSchema, latestFormSchema])

  return (
    <div className="flex h-full flex-col">
      <FormToolbar latestFormSchema={latestFormSchema} isSchemaDifferent={isSchemaDifferent} />
      <div className="flex-1 overflow-y-auto p-4">
        <FormRenderer formSchema={latestFormSchema} isSchemaDifferent={isSchemaDifferent} />
      </div>
    </div>
  )
}
