import { createFileRoute } from "@tanstack/react-router";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { messages, status, sendMessage } = useChat();

  const [text, setText] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    setIsDirty(true);
    sendMessage({ text: message.text || "" });
    setText("");
  };

  const handleSuggestion = (suggestion: string) => {
    setText(suggestion);
    handleSubmit({ text: suggestion });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[48rem]">
        {!isDirty && (
          <div className="mt-60 flex justify-center mb-6">
            <span className="text-4xl">🧁</span>
          </div>
        )}
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="relative">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => {
                setText(e.target.value);
              }}
              value={text}
              placeholder="Describe tu formulario"
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools></PromptInputTools>
            <PromptInputSubmit
              disabled={!text && status !== "streaming"}
              status={status}
            />
          </PromptInputToolbar>
        </PromptInput>
        {!isDirty && (
          <Suggestions className="mt-4">
            <Suggestion
              suggestion="¿Cómo funciona?"
              onClick={handleSuggestion}
            />
            <Suggestion
              suggestion="Formularios predefinidos"
              onClick={handleSuggestion}
            />
          </Suggestions>
        )}
      </div>
    </div>
  );
}
