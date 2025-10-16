import { useMutation } from '@tanstack/react-query'

interface CreateFormSubmissionData {
  values: Record<string, any>
  formSettingsShortId: string
}

interface CreateFormSubmissionResponse {
  success: boolean
  formId: number
  message: string
  fileUploads: Array<{
    field: string
    fileId: number
    associationId: number
    fileName: string
  }>
  customAnswers: Record<string, any>
}

export function useCreateFormSubmission() {
  return useMutation<
    CreateFormSubmissionResponse,
    Error,
    CreateFormSubmissionData
  >({
    mutationFn: async (data: CreateFormSubmissionData) => {
      // Create FormData from values object
      const formData = new FormData()

      // Add all values to FormData
      Object.entries(data.values).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value)
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })

      const response = await fetch(
        `/api/create-form-submission/${data.formSettingsShortId}`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error?.message || 'Failed to create form submission',
        )
      }

      return response.json()
    },
  })
}
