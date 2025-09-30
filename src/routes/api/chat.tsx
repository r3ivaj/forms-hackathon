import { createFileRoute } from '@tanstack/react-router'
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai'
import { json } from '@tanstack/react-start'
import { openai } from '@ai-sdk/openai'
import { validateFormSchema } from '@/lib/tools/validateFormSchema'
import { getSchemaFromTemplate } from '@/lib/tools/getSchemaFromTemplate'
import { getTemplatesList } from '@/lib/tools/getTemplatesList'

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
              getSchemaFromTemplate,
              getTemplatesList,
            },
            system: `
              You are an assistant that helps users create forms. Users can either select from a list of available templates or request a custom form.

              Important: Never display or mention any "id" fields or values from the data structures (such as templates, forms, steps, or fields) in your responses to the user. Only show user-friendly information like names, titles, and descriptions.

              - If the user asks about available templates, call the \`getTemplatesList\` tool to get and show the current list, but do not show any ids.
              - If the user describes what they need, try to infer if an existing template matches their request. If so, recommend the template (without showing its id) and ask the user to confirm if it is the one they want.
              - If the user wants to use a template, call the \`getSchemaFromTemplate\` tool to get the corresponding form schema.
              - If the user wants a custom form, generate a form schema based on their requirements.
              - In both cases, call the \`validateFormSchema\` tool to ensure the schema is valid.
              - If the schema is not valid, correct it and call the tool again until it is valid.
              - If the user tries to talk about other topics, politely remind them that you can only help with form creation.
              - When the schema is valid, send a final message confirming that the form was generated successfully and include a brief summary, but do not include any ids in your summary.
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
