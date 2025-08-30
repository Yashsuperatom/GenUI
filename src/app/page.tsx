"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect ,useLayoutEffect } from "react";
import Markdown from "@/app/RuntimeComponents/MemoizedMarkdown"
import Hero from "@/app/RuntimeComponents/Hero";
import MotionWrapper from "./RuntimeComponents/MotionWrapper";
import { Icon } from "@iconify/react";
import { NodeType  } from "./types/types";
import UIRenderer from "./RuntimeComponents/UIRenderer";
import { T_UI_Component } from "./types/UIschema";

export default function Runtime() {
  const [inputValue, setInputValue] = useState("");
  const [currentSchema,setCurrentSchema] = useState<T_UI_Component>("")
  const { messages, sendMessage, status } = useChat();
  const maxLength = 3000;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);



  // for handle the button
     // Define handlers that can be used in generated UI
    const handlers = {
        handleClick: () => alert('Button clicked!'),
        handleSubmit: (e: React.FormEvent) => {
            e.preventDefault()
        }
    }

  // for scroll features 

useLayoutEffect(() => {
  const container = containerRef.current;
  if (container) {
    container.scrollTop = container.scrollHeight; // instant snap
  }
}, [messages]);


  // for padding
  useEffect(() => {
  if (inputContainerRef.current) {
    setInputHeight(inputContainerRef.current.offsetHeight);
  }
}, [inputValue]); 

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);


  // for option to show int textarea
  const handleOptionClick = (value: string) => {
    setInputValue(value);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  // submit message
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage({ text: inputValue });
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen  bg-white  ">
      <div ref={containerRef} className=" flex  overflow-y-auto h-screen  justify-center   ">

        {/* Chat area  */}
        <div
          className=" px-[5vw] w-full lg:max-w-[60vw] max-w-[8vw]:    "
          style={{ paddingBottom: inputHeight }}
        >
          {messages.length === 0 && <Hero onOptionClick={handleOptionClick} />}

          {messages.map((message, idx) => {
            const isLastAIStreaming =
              message.role === "assistant" &&
              status === "streaming" &&
              idx === messages.length - 1;

            return (
              <div
                key={message.id}
                className={`w-full flex gap-2 sm:gap-3 py-6  ${message.role === "user" ? "justify-end" : "justify-start"
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
                  className={`w-fit sm:max-w-[85%] lg:max-w-[75%] xl:max-w-[70%] py-1 px-4 rounded-xl break-words ${message.role === "user"
                      ? "bg-indigo-100 text-gray-900 rounded-tr-lg ml-auto"
                      : "bg-gray-100 text-gray-900 rounded-tl-lg flex items-start"
                    }`}
                >
                  <div className="w-">
                    {message.parts.map((part, index) => {
                      if (part.type === "tool-ui-block" || part.type === "tool-layout") {
                        switch (part.state) {
                          case "output-available":
                            console.log("2")
                            return <UIRenderer schema={currentSchema} handlers={handlers} />;
                          case "output-error":
                            console.log("3")
                            return <div key={index} className="text-red-500">Error: {part.errorText}</div>;
                          case "input-streaming":
                            console.log("4")
                            return <div key={index} className="text-gray-500">Loading UI...</div>;
                          default:
                            return null;
                        }
                      }

                      else if (part.type === "text") {
                        try {
                          const maybeJson = JSON.parse(part.text);
                          if (maybeJson.type && maybeJson.props) {
                            console.log("1")
                            return <UIRenderer schema={currentSchema} handlers={handlers} />;
                          }
                        } catch { }
                        console.log("6")
                        return <Markdown key={index} content={part.text} />;
                      }

                      return null;
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
          })}
          {/* this is for for bottom height and scroll feature */}
          {messages.length > 0 && <div  className=" lg:h-[25vh] sm:h-[60vh]" />}
        </div>

        {/* Input box with height tracking */}
        <div  className=" fixed bottom-0 w-full max-w-[50vw] bg-white rounded-t-full  justify-center ">
          <MotionWrapper>
            <div className="group rounded-2xl mx-auto justify-center w-full">
              <div
                className="flex flex-col   gap-2 rounded-2xl bg-gradient-to-r from-transparent to-transparent
      group-focus-within:from-[#68a4c2] group-focus-within:to-[#927db8] transition-colors duration-200 p-[1.5px] bg-gray-100 shadow-md"
              >
                {/* inner white box stays same size always */}
                <div className="flex flex-col bg-white rounded-2xl overflow-hidden relative">
                  <div className="flex items-center gap-2 sm:gap-3 px-2">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      placeholder="Say something..."
                      onChange={(e) => setInputValue(e.currentTarget.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      rows={1}
                      className="flex-grow w-full max-h-32 sm:max-h-24 resize-none overflow-y-auto focus:outline-none text-sm sm:text-base"
                      maxLength={maxLength}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || status === "streaming"}
                      className="text-gray-400 hover:text-indigo-500 transition-colors duration-200 rounded-full hover:bg-gray-100 p-1 sm:p-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Icon
                        icon="ph:paper-plane-right-fill"
                        width={20}
                        height={20}
                        className="sm:w-6 sm:h-6"
                      />
                    </button>
                  </div>

                  <hr className="border-t border-gray-200" />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-gray-500 text-xs sm:text-sm bg-gray-50 p-2">
                    <div className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
                      <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors duration-200 cursor-pointer">
                        <Icon icon="ph:paperclip-fill" width="16" height="16" className="sm:w-[18px] sm:h-[18px]" />
                        <span className="font-medium">Attach</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors duration-200 cursor-pointer">
                        <Icon icon="ph:microphone-fill" width="16" height="16" className="sm:w-[18px] sm:h-[18px]" />
                        <span className="font-medium hidden xs:inline">Voice</span>
                        <span className="font-medium xs:hidden">Mic</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors duration-200 cursor-pointer">
                        <Icon icon="ph:text-t-fill" width="16" height="16" className="sm:w-[18px] sm:h-[18px]" />
                        <span className="font-medium hidden sm:inline">Browse Prompts</span>
                        <span className="font-medium sm:hidden">Prompts</span>
                      </button>
                    </div>
                    <div className="text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">
                      {inputValue.length} / {maxLength}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center my-4 text-gray-500 text-xs sm:text-sm px-4 ">
              Script may generate inaccurate information about people, places, or facts. Model: Script AI v1.3
            </p>
          </MotionWrapper>

        </div>
      </div>
    </div>
  );
}