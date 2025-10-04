import { useFormSchemaByShortId } from '@/hooks/useFormSchemaByShortId'
import { createFileRoute } from '@tanstack/react-router'
import { FormRenderer } from '@/components/chat/FormRenderer'
import { EmptySection } from '@/components/EmptySection'
import { FileX } from 'lucide-react'

export const Route = createFileRoute('/formulario/$shortId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { shortId } = Route.useParams()
  const { data } = useFormSchemaByShortId(shortId)


  if (data?.status === 'draft' || !data?.formSchema) {
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


  return <FormRenderer formSchema={data.formSchema} />
}
