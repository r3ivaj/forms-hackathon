import { useFormSettingsByShortId } from '@/hooks/useFormSettingsByShortId'
import { createFileRoute } from '@tanstack/react-router'
import { FormRenderer } from '@/components/chat/form-renderer/FormRenderer'
import { EmptySection } from '@/components/EmptySection'
import { FileX } from 'lucide-react'
import { useMemo } from 'react'

export const Route = createFileRoute('/formulario/$formSettingsShortId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { formSettingsShortId } = Route.useParams()
  const { data } = useFormSettingsByShortId(formSettingsShortId)

  const formSchema = useMemo(() => {
    if (!data?.formSchema) {
      return null
    }
    return JSON.parse(data.formSchema)
  }, [data?.formSchema])

  if (!data) {
    return null
  }

  if (data.status === 'draft') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptySection
          icon={FileX}
          title="Formulario no encontrado"
          description="El formulario que buscas no existe o no está disponible"
        />
      </div>
    )
  }

  return <FormRenderer formSchema={formSchema} />
}
