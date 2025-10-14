import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input'
import {
  Conversation as ConversationWrapper,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Message, MessageContent } from '@/components/ai-elements/message'
import { Response } from '@/components/ai-elements/response'
import { Reasoning, ReasoningTrigger } from '@/components/ai-elements/reasoning'
import { Loader } from '@/components/ai-elements/loader'
import { useState } from 'react'
import type { UIMessage } from '@ai-sdk/react'

interface ConversationProps {
  messages: UIMessage[]
  status: string
  onSendMessage: (message: { text: string }) => void
}

export function Conversation({
  messages,
  status,
  onSendMessage,
}: ConversationProps) {
  const [text, setText] = useState<string>('')

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)

    if (!hasText) {
      return
    }

    onSendMessage({ text: message.text || '' })
    setText('')
  }

  return (
    <div className="flex h-full flex-col p-4">
      <ConversationWrapper>
        <ConversationContent>
          {messages
            .filter((message) => !(message.metadata as any)?.programmatic)
            .map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part: any, i: number) => {
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
      </ConversationWrapper>
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
            status={status as any}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  )
}
