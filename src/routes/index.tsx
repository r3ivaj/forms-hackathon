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
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { messages, status, sendMessage } = useChat()

  const [text, setText] = useState<string>('')

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)

    if (!hasText) {
      return
    }

    sendMessage({ text: message.text || '' })
    setText('')
  }

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full flex-col p-4">
            <Conversation>
              <ConversationContent>
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
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
        <ResizablePanel defaultSize={75} minSize={65}>
          <div className="h-full rounded-lg p-4">
            <h3 className="mb-4 text-lg font-semibold">Preview</h3>
            <div className="text-muted-foreground">
              Content preview will appear here
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
