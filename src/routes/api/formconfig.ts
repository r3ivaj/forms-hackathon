import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../convex/_generated/api'

export const Route = createFileRoute('/api/formconfig')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { name, slug, chatId } = await request.json()

          // Validate required parameters
          if (!name || !slug || !chatId) {
            return json(
              { error: { message: 'name, slug and chatId are required' } },
              { status: 400 }
            )
          }

          // Get the API URL from environment variable
          const apiUrl = process.env.MOFFIN_API_URL!

          // Prepare the request body
          const requestBody = {
            name,
            slug,
            configuration: {
              isActive: true,
            },
          }

          // Get the API key from environment variable
          const apiKey = process.env.MOFFIN_API_KEY!

          // Make the POST request to the external API
          const response = await fetch(`${apiUrl}/v1/formconfigs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${apiKey}`,
            },
            body: JSON.stringify(requestBody)
          })

          if (!response.ok) {
            const errorText = await response.text()
            return json(
              { error: { message: `External API error: ${response.status} - ${errorText}` } },
              { status: response.status }
            )
          }

          const data = await response.json()
          console.log('data', data)
          // Initialize Convex client
          const convex = new ConvexHttpClient(process.env.CONVEX_URL!)

          // Update formSettings with Moffin data
          await convex.mutation(api.formSettings.patchFormSettings, {
            chatId: chatId,
            externalFormConfigId: data.id,
            publishedOnce: true,
          })

          return json(data)

        } catch (error) {
          console.error('Formconfig endpoint error:', error)
          return json(
            { error: { message: 'Internal server error' } },
            { status: 500 }
          )
        }
      },
    },
  },
})
