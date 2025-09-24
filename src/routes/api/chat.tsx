import { createFileRoute } from "@tanstack/react-router";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { json } from "@tanstack/react-start";
import { openai } from "@ai-sdk/openai";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages }: { messages: UIMessage[] } = await request.json();

          const result = streamText({
            model: openai("gpt-5-mini"),
            messages: convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse();
        } catch (error) {
          return json(
            { error: { message: "There was an error" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
