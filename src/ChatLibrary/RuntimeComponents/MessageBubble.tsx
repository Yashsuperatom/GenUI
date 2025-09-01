import { ChatMessage, ChatHandlers } from "../types/types";
import Markdown from "./MemoizedMarkdown";
import UIRenderer from "./UIRenderer";
import React from "react";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming: boolean;
  currentSchema: any;
  handlers: ChatHandlers;
}

export default function MessageBubble({ 
  message, 
  isStreaming, 
  currentSchema, 
  handlers 
}: MessageBubbleProps) {

  
  return (
    <div
      className={`w-full flex gap-2 sm:gap-3 py-6 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI badge */}
      {message.role !== "user" && (
        <div className="flex flex-col items-center justify-start flex-shrink-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs sm:text-sm">
            A
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`w-fit sm:max-w-[85%] lg:max-w-[75%] xl:max-w-[70%] py-1 px-4 rounded-xl break-words ${
          message.role === "user"
            ? "bg-indigo-100 text-gray-900 rounded-tr-lg ml-auto"
            : "bg-gray-100 text-gray-900 rounded-tl-lg flex items-start"
        }`}
      >
        <div className="w-full">
          {message.parts.map((part, index) => {
            if (part.type === "text") 
              return <Markdown key={`${message.id}-${index}`} content={part.text} />;
            else  if (part.type === "tool-ui-block" || part.type === "tool-layout") {
              switch (part.state) {
                case "output-available":
                  return <UIRenderer key={index} schema={currentSchema} handlers={handlers} />;
                case "output-error":
                  return (
                    <div key={index} className="text-red-500">
                      Error: {part.errorText}
                    </div>
                  );
                case "input-streaming":
                  return (
                    <div key={index} className="text-gray-500">
                      Loading UI...
                    </div>
                  );
                default:
                  return null;
              }
            } 
             
          })}
        </div>
      </div>

      {/* User badge */}
      {message.role === "user" && (
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-400 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
}