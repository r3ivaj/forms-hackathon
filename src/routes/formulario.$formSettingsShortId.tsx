import { useFormSettingsByShortId } from '@/hooks/useFormSettingsByShortId'
import { useCreateFormSubmission } from '@/hooks/useCreateFormSubmission'
import { createFileRoute } from '@tanstack/react-router'
import { FormRenderer } from '@/components/chat/form-renderer/FormRenderer'
import { EmptySection } from '@/components/EmptySection'
import { FileX } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  FormSubmissionLoading,
  FormSubmissionSuccess,
  FormSubmissionError,
} from '@/components/chat/form-renderer/FormSubmissionStates'

export const Route = createFileRoute('/formulario/$formSettingsShortId')({
  component: RouteComponent,
})

type SubmissionState = 'idle' | 'loading' | 'success' | 'error'

function RouteComponent() {
  const { formSettingsShortId } = Route.useParams()
  const { data } = useFormSettingsByShortId(formSettingsShortId)
  const createFormSubmissionMutation = useCreateFormSubmission()
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>('idle')

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
      setSubmissionState('loading')

      console.log('Submitting form with values:', values)

      const result = await createFormSubmissionMutation.mutateAsync({
        values,
        formSettingsShortId,
      })

      console.log('Form submitted successfully:', result)
      setSubmissionState('success')
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmissionState('error')
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

  // Render different states based on submission status
  if (submissionState === 'loading') {
    return <FormSubmissionLoading />
  }

  if (submissionState === 'success') {
    return <FormSubmissionSuccess />
  }

  if (submissionState === 'error') {
    return <FormSubmissionError />
  }

  return <FormRenderer formSchema={formSchema} onSubmit={onSubmit} />
}
