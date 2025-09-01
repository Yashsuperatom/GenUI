// /app/api/chat/route.ts
// import { openai } from "@ai-sdk/openai";
import {createOpenRouter} from "@openrouter/ai-sdk-provider"
import { streamText, UIMessage, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const startTime = Date.now(); 
  console.log("Calling LLM at:", new Date(startTime).toISOString());
  const { messages }: { messages: UIMessage[] } = await req.json();
  const openrouter = createOpenRouter({
  apiKey:process.env.OPENROUTER_API_KEY!,
});

console.log("Calling LLM at:", new Date().toISOString()); 
  const result = streamText({
    model : openrouter.chat("openai/gpt-5"),
    messages: convertToModelMessages(messages),
  });

  console.log("LLM responded at:", new Date().toISOString(), "Duration:", Date.now() - startTime, "ms");
  return result.toUIMessageStreamResponse();
}
