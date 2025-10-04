import { useFormSchemaByShortId } from '@/hooks/useFormSchemaByShortId'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/formulario/$shortId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { shortId } = Route.useParams()
  const { data: formSchema } = useFormSchemaByShortId(shortId)

  console.log(formSchema)

  return <div>Hello "/formulario/$shortId"!</div>
}
