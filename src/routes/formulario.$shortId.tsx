import { useFormSchemaByShortId } from '@/hooks/useFormSchemaByShortId'
import { createFileRoute } from '@tanstack/react-router'
import { FormRenderer } from '@/components/chat/FormRenderer'

export const Route = createFileRoute('/formulario/$shortId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { shortId } = Route.useParams()
  const { data } = useFormSchemaByShortId(shortId)

  if (!data?.formSchema) {
    return null
  }

  return <FormRenderer formSchema={data.formSchema} />
}
