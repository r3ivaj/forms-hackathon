import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputToolbar, PromptInputSubmit } from '@/components/ai-elements/prompt-input'
import { useCreateChat } from '@/hooks/useCreateChat'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { createChat, isCreating } = useCreateChat()
  const navigate = useNavigate()
  const [textValue, setTextValue] = useState('')

  const handleSubmit = async (message: { text?: string; files?: any[] }, event: React.FormEvent<HTMLFormElement>) => {
    if (!message.text) {
      return
    }

    const chatId = await createChat()
    localStorage.setItem(`${chatId}:initialMessage`, message.text.trim() || '')
    await navigate({ to: '/c/$chatId', params: { chatId } })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto pt-[20vh]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">¿Qué formulario quieres crear?</h1>
          <p className="text-lg text-muted-foreground">Comienza a construir con una sola descripción.</p>
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
