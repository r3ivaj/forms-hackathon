import { createFileRoute } from '@tanstack/react-router'
import { useChat as useAIChat } from '@ai-sdk/react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { useState, useEffect, useRef } from 'react'
import { FormsPreview } from '@/components/chat/FormsPreview'
import { Conversation } from '@/components/chat/Conversation'
import { getValidFormSchema } from '@/utils/chat/getValidFormSchema'
import { FormSchema } from '@/lib/tools/validateFormSchema'
import type { Id } from "../../convex/_generated/dataModel"
import { useChat } from '@/hooks/useChat'
import { useMutateChatMessages } from '@/hooks/useMutateChatMessages'
export const Route = createFileRoute('/c/$chatId')({
  component: Home,
})

function Home() {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null)
  const chatLoadedOnce = useRef(false)
  const { chatId } = Route.useParams()
  const { chat, isLoading } = useChat(chatId as Id<"chats">)
  const { mutateChatMessages } = useMutateChatMessages({ id: chatId as Id<"chats"> })

  const { messages, status, sendMessage, setMessages } = useAIChat({
    id: chatId,
    onFinish: ({ messages }) => {
      mutateChatMessages(JSON.stringify(messages))
    },
  })

  useEffect(() => {
    if (chat) {
      chatLoadedOnce.current = true
      if (chat.messages) {
        setMessages(JSON.parse(chat.messages))
      } else {
        sendMessage({ text: localStorage.getItem(`${chatId}:initialMessage`) || '' })
      }
    }
  }, [chat, sendMessage, setMessages])

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
          {!isLoading && <FormsPreview formSchema={formSchema} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
