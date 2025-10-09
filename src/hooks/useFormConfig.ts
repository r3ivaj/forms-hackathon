import { useMutation } from '@tanstack/react-query'

interface FormConfigData {
  accountType: string
  name: string
  slug: string
  chatId: string
}

interface FormConfigResponse {
  // Define the response type based on what the API returns
  [key: string]: any
}

export function useFormConfig() {
  return useMutation<FormConfigResponse, Error, FormConfigData>({
    mutationFn: async (data: FormConfigData) => {
      const response = await fetch('/api/formconfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to create form config')
      }

      return response.json()
    },
  })
}
