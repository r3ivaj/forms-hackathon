import { createFileRoute } from '@tanstack/react-router'
import { useChat } from '@ai-sdk/react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { useState, useEffect } from 'react'
import { FormsPreview } from '@/components/chat/FormsPreview'
import { Conversation } from '@/components/chat/Conversation'
import { getValidFormSchema } from '@/utils/chat/getValidFormSchema'
import { FormSchema } from '@/lib/tools/validateFormSchema'
import { useChatPersistence } from '@/hooks/useChatPersistence'

export const Route = createFileRoute('/c/')({
  component: Home,
})

function Home() {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null)
  const { persistMessages } = useChatPersistence()

  const { messages, status, sendMessage } = useChat({
    onFinish: async ({ messages }) => {
      await persistMessages(messages)
    },
  })

  useEffect(() => {
    const validFormSchema = getValidFormSchema(messages)
    if (validFormSchema) {
      setFormSchema(validFormSchema)
    }
  }, [messages])

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={25}>
          <Conversation
            messages={messages}
            status={status}
            onSendMessage={sendMessage}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={55}>
          <FormsPreview formSchema={formSchema} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
