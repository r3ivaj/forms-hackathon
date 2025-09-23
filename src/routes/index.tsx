import { createFileRoute } from '@tanstack/react-router'
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';


import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {

  const [message, setMessage] = useState('');

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[48rem]">
        <div className="mt-60 flex justify-center mb-6">
          <span className="text-4xl">🧁</span>
        </div>
        <PromptInput onSubmit={(message, event) => {
          console.log(message, event);
        }} className="relative">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => { setMessage(e.target.value) }}
              value={message}
              placeholder="Describe tu formulario"
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={false}
              status={'ready'}
            />
          </PromptInputToolbar>
        </PromptInput>

        <Suggestions className="mt-4">
          <Suggestion suggestion="Onboarding Persona Física" />
          <Suggestion suggestion="Onboarding Persona Moral" />
        </Suggestions>
      </div>
    </div>
  )
}
