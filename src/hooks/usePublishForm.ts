import { useMutation } from '@tanstack/react-query'

interface PublishFormData {
  name: string
  slug: string
  chatId: string
  formSchema: any
}

interface PublishFormResponse {
  success: boolean
  formConfig: {
    id: number
    [key: string]: any
  }
  customPagesConfig: any
  message: string
}

export function usePublishForm() {
  return useMutation<PublishFormResponse, Error, PublishFormData>({
    mutationFn: async (data: PublishFormData) => {
      const response = await fetch('/api/publish-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to publish form')
      }

      return response.json()
    },
  })
}
