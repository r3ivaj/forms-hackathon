import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input'
import { useCreateChat } from '@/hooks/useCreateChat'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { createChat, isCreating } = useCreateChat()
  const navigate = useNavigate()
  const [textValue, setTextValue] = useState('')

  const handleSubmit = async (
    message: { text?: string; files?: any[] },
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    if (!message.text) {
      return
    }

    const chatId = await createChat()
    localStorage.setItem(`${chatId}:initialMessage`, message.text.trim() || '')
    await navigate({ to: '/c/$chatId', params: { chatId } })
  }

  return (
    <div className="bg-background min-h-screen p-4">
      <div className="mx-auto max-w-4xl pt-[20vh]">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            ¿Qué formulario quieres crear?
          </h1>
          <p className="text-muted-foreground text-lg">
            Comienza a construir con una sola descripción.
          </p>
        </div>

        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Pidele al asistente el formulario que quieres crear..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
            <PromptInputToolbar>
              {/* empty div to align the submit button to the right */}
              <div />
              <PromptInputSubmit
                disabled={!textValue.trim() || isCreating}
                status={isCreating ? 'submitted' : 'ready'}
              />
            </PromptInputToolbar>
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  )
}
