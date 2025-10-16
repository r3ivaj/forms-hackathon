import { useFormSettingsByShortId } from '@/hooks/useFormSettingsByShortId'
import { useCreateFormSubmission } from '@/hooks/useCreateFormSubmission'
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
  const createFormSubmissionMutation = useCreateFormSubmission()

  const formSchema = useMemo(() => {
    if (!data?.formSchema) {
      return null
    }
    return JSON.parse(data.formSchema)
  }, [data?.formSchema])

  if (!data) {
    return null
  }

  const onSubmit = async (values: any) => {
    try {
      console.log('Submitting form with values:', values)

      const result = await createFormSubmissionMutation.mutateAsync({
        values,
        formSettingsShortId,
      })

      console.log('Form submitted successfully:', result)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  if (data.status === 'draft') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <EmptySection
          icon={FileX}
          title="Formulario no encontrado"
          description="El formulario que buscas no existe o no está disponible"
        />
      </div>
    )
  }

  return <FormRenderer formSchema={formSchema} onSubmit={onSubmit} />
}
