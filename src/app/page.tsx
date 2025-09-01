"use client"

import { ChatRuntime , useChatLibrary } from "@/ChatLibrary"


export default function App() {
  const { config, handlers } = useChatLibrary();

  return (
    <div className="h-screen">
      <ChatRuntime config={config} handlers={handlers} />
    </div>
  );
}