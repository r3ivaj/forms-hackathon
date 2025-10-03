import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputToolbar, PromptInputSubmit } from '@/components/ai-elements/prompt-input'
import { useCreateChat } from '@/hooks/useCreateChat'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { createChat } = useCreateChat()
  const navigate = useNavigate()

  const handleSubmit = async (message: { text?: string; files?: any[] }, event: React.FormEvent<HTMLFormElement>) => {
    const chatId = await createChat()
    localStorage.setItem(`${chatId}:initialMessage`, message.text || '')
    navigate({ to: '/c/$chatId', params: { chatId } })
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
            <PromptInputTextarea placeholder="Pidele al asistente el formulario que quieres crear..." />
            <PromptInputToolbar>
              {/* empty div to align the submit button to the right */}
              <div />
              <PromptInputSubmit />
            </PromptInputToolbar>
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  )
}
