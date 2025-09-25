import { createFileRoute } from '@tanstack/react-router'
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai'
import { json } from '@tanstack/react-start'
import { openai } from '@ai-sdk/openai'
import { validateFormSchema } from '@/lib/tools/validateFormSchema'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages }: { messages: UIMessage[] } = await request.json()

          const result = streamText({
            model: openai('gpt-5-mini'),
            messages: convertToModelMessages(messages),
            tools: {
              validateFormSchema,
            },
            system: `
              You are an assistant that helps users create forms.

              - Only respond to user messages that are greetings or requests to create forms.
              - If the user tries to talk about anything else, politely remind them that you can only help with creating forms.
              - When the user requests a form, you must generate a JSON candidate and call the \`validateFormSchema\` tool.
              - If the tool output says the JSON is invalid, correct it and call the tool again until it is valid.
              - Once the tool confirms the JSON is valid, always send a final assistant text message to the user confirming that the form was generated successfully, and include a brief summary.
            `,
            stopWhen: stepCountIs(10),
            onError: (error) => {
              console.error(error)
            },
          })

          return result.toUIMessageStreamResponse()
        } catch (error) {
          return json(
            { error: { message: 'There was an error' } },
            { status: 500 },
          )
        }
      },
    },
  },
})
