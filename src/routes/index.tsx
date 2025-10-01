import { createFileRoute } from '@tanstack/react-router'
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input'
import { useChat } from '@ai-sdk/react'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Message, MessageContent } from '@/components/ai-elements/message'
import { Response } from '@/components/ai-elements/response'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { useState, useEffect } from 'react'
import { Reasoning, ReasoningTrigger } from '@/components/ai-elements/reasoning'
import { Loader } from '@/components/ai-elements/loader'
import { FormsPreview } from '@/components/chat/FormsPreview'
import { getValidFormSchema } from '@/utils/chat/getValidFormSchema'
import { FormSchema } from '@/lib/tools/validateFormSchema'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { messages, status, sendMessage } = useChat()

  const [text, setText] = useState<string>('')
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null)

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)

    if (!hasText) {
      return
    }

    sendMessage({ text: message.text || '' })
    setText('')
  }

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
          <div className="flex h-full flex-col p-4">
            <Conversation>
              <ConversationContent>
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'reasoning':
                            return (
                              <Reasoning
                                key={`${message.id}-${i}`}
                                className="w-full"
                                isStreaming={
                                  status === 'streaming' &&
                                  i === message.parts.length - 1 &&
                                  message.id === messages.at(-1)?.id
                                }
                              >
                                <ReasoningTrigger />
                              </Reasoning>
                            )
                          case 'text':
                            return (
                              <Response key={`${message.id}-${i}`}>
                                {part.text}
                              </Response>
                            )
                          default:
                            return null
                        }
                      })}
                    </MessageContent>
                  </Message>
                ))}
                {status === 'submitted' && <Loader />}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
            <PromptInput onSubmit={handleSubmit} className="mt-auto">
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(e) => {
                    setText(e.target.value)
                  }}
                  value={text}
                  placeholder=""
                />
              </PromptInputBody>
              <PromptInputToolbar>
                <PromptInputTools></PromptInputTools>
                <PromptInputSubmit
                  disabled={!text && status !== 'streaming'}
                  status={status}
                />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={55}>
          <FormsPreview formSchema={formSchema} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
