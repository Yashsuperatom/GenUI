// /app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { tools } from "@/app/Tools/Tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // find the last user message
  const lastUser = [...messages].reverse().find(m => m.role === "user");

  //  extract text from all text parts
  const lastText =
    lastUser?.parts
      .filter(p => p.type === "text")
      .map(p => (p as any).text)
      .join(" ")
      .toLowerCase() || "";

  // match dashboard/layout/etc, with optional number suffix (dashboard1, layout2, etc.)
  const wantsLayout = /\b(dash\s*board\d*|dashboard\d*|layout\d*|report\d*|screen\d*|ui\d*)\b/.test(
    lastText
  );

  const system = `
You are a helpful assistant.

- If the user asks for a dashboard, screen, report, or layout:
  → You MUST call the "layout" tool with the correct layout ID (e.g. dashboard1, dashboard2).
  → Do not output text like "[layout: dashboard1]".
  → Only call the tool, nothing else.
- Otherwise, just answer normally in text.
- Do NOT mix tool output and text in the same reply.
`;

  const result = streamText({
    model: openai("gpt-4o"),
    system,
    messages: convertToModelMessages(messages),
    tools,
    toolChoice: wantsLayout
      ? { type: "tool", toolName: "layout" } // force tool call when match
      : "auto",
  });

  // Debug logs
  console.log("👉 lastText:", lastText);
  console.log("👉 wantsLayout?", wantsLayout);
  console.log("👉 lastUser message:", lastUser);

  return result.toUIMessageStreamResponse();
}
