import { createFileRoute } from '@tanstack/react-router'
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai'
import { json } from '@tanstack/react-start'
import { openai } from '@ai-sdk/openai'
import { validateFormSchema } from '@/lib/tools/validateFormSchema'
import { getSchemaFromTemplate } from '@/lib/tools/getSchemaFromTemplate'
import { getTemplatesList } from '@/lib/tools/getTemplatesList'
import { formSchema } from '@/utils/schemas/formSchema'
import { z } from 'zod'
import createSystemPrompt from '@/utils/chat/createSystemPrompt'

const jsonSchema = z.toJSONSchema(formSchema)

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages }: { messages: UIMessage[] } = await request.json()
          const model = process.env.OPENAI_MODEL

          if (!model) {
            throw new Error('model is not set')
          }

          const result = streamText({
            model: openai(model),
            messages: convertToModelMessages(messages),
            tools: {
              validateFormSchema,
              getSchemaFromTemplate,
              getTemplatesList,
            },
            system: createSystemPrompt(jsonSchema),
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
