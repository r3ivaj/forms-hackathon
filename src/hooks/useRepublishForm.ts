import { useMutation } from '@tanstack/react-query'

interface RepublishFormData {
  chatId: string
  formSchema: any
}

interface RepublishFormResponse {
  success: boolean
  formConfig: {
    id: number
    message: string
  }
  customPagesConfig: any
  message: string
  republishedAt: string
}

export function useRepublishForm() {
  return useMutation<RepublishFormResponse, Error, RepublishFormData>({
    mutationFn: async (data: RepublishFormData) => {
      const response = await fetch('/api/republish-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to republish form')
      }

      return response.json()
    },
  })
}
