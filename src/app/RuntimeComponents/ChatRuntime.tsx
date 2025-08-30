"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useLayoutEffect, forwardRef, useImperativeHandle } from "react";
import { ChatMessage, ChatConfig, ChatHandlers } from "../types/types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./InputBox";
import Hero from "./Hero";

export interface ChatRuntimeRef {
  sendMessage: (message: string) => void;
  clearMessages: () => void;
  getMessages: () => ChatMessage[];
}

interface ChatRuntimeProps {
  config?: ChatConfig;
  handlers?: ChatHandlers;
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (message: ChatMessage) => void;
  className?: string;
  heroComponent?: React.ComponentType<{ onOptionClick: (value: string) => void }>;
}

const ChatRuntime = forwardRef<ChatRuntimeRef, ChatRuntimeProps>(({
  config = {},
  handlers = {},
  onMessageSent,
  onMessageReceived,
  className = "",
  heroComponent: CustomHero
}, ref) => {
  const {
    maxLength = 3000,
    placeholder = "Say something...",
    enableVoice = true,
    enableAttachments = true,
    enablePrompts = true,
    modelName = "Script AI v1.3",
    onError
  } = config;

  const [inputValue, setInputValue] = useState("");
  const [currentSchema, setCurrentSchema] = useState<any>("");
  const { messages, sendMessage, status, error } = useChat();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState(0);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => {
      sendMessage({ text: message });
      onMessageSent?.(message);
    },
    clearMessages: () => {
      // Implementation depends on your chat library
    },
    getMessages: () => messages as ChatMessage[]
  }));

  // Handle errors
  useEffect(() => {
    if (error && onError) {
      onError(new Error(error.message || "Chat error occurred"));
    }
  }, [error, onError]);

  // Auto-scroll to bottom
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Handle message received
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant" && onMessageReceived) {
      onMessageReceived(lastMessage as ChatMessage);
    }
  }, [messages, onMessageReceived]);

  const handleOptionClick = (value: string) => {
    setInputValue(value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && status !== "streaming") {
      sendMessage({ text: inputValue });
      onMessageSent?.(inputValue);
      setInputValue("");
    }
  };

  const HeroComponent = CustomHero || Hero;

  return (
    <div className={`flex flex-col w-full h-screen bg-white ${className}`}>
      <div 
        ref={containerRef} 
        className="flex overflow-y-auto h-screen justify-center"
      >
        <div
          className="px-[5vw] w-full lg:max-w-[60vw]"
          style={{ paddingBottom: inputHeight }}
        >
          {messages.length === 0 && (
            <HeroComponent onOptionClick={handleOptionClick} />
          )}

          {messages.map((message, idx) => (
            <MessageBubble
              key={message.id}
              message={message as ChatMessage}
              isStreaming={
                message.role === "assistant" &&
                status === "streaming" &&
                idx === messages.length - 1
              }
              currentSchema={currentSchema}
              handlers={handlers}
            />
          ))}

          {messages.length > 0 && <div className="lg:h-[25vh] sm:h-[60vh]" />}
        </div>
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onHeightChange={setInputHeight}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={status === "streaming"}
        enableVoice={enableVoice}
        enableAttachments={enableAttachments}
        enablePrompts={enablePrompts}
        modelName={modelName}
      />
    </div>
  );
});

ChatRuntime.displayName = "ChatRuntime";

export default ChatRuntime;