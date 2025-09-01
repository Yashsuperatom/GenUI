export { default as ChatRuntime } from "./RuntimeComponents/ChatRuntime";
export { default as MessageBubble } from "./RuntimeComponents/MessageBubble";
export { default as ChatInput } from "./RuntimeComponents/InputBox";
export { default as UIRenderer } from "./RuntimeComponents/UIRenderer";
export * from "./types/types";

// hooks/useChatLibrary.ts
import { useState, useCallback } from "react";
import { ChatMessage, ChatConfig, ChatHandlers } from "./types/types";

export function useChatLibrary(initialConfig?: ChatConfig) {
  const [config, setConfig] = useState<ChatConfig>(initialConfig || {});
  const [handlers, setHandlers] = useState<ChatHandlers>({});

  const updateConfig = useCallback((newConfig: Partial<ChatConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const addHandler = useCallback((name: string, handler: (...args: any[]) => any) => {
    setHandlers(prev => ({ ...prev, [name]: handler }));
  }, []);

  const removeHandler = useCallback((name: string) => {
    setHandlers(prev => {
      const newHandlers = { ...prev };
      delete newHandlers[name];
      return newHandlers;
    });
  }, []);

  return {
    config,
    handlers,
    updateConfig,
    addHandler,
    removeHandler
  };
}