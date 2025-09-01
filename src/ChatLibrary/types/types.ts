
 export interface NodeType {
  type: string;
  props?: Record<string, any>;
  children?: string | NodeType | (string | NodeType)[];

};

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
  timestamp?: Date;
}

export interface MessagePart {
  type: "text" | "tool-ui-block" | "tool-layout";
  text?: any;
  state?: "output-available" | "output-error" | "input-streaming";
  errorText?: string;
}

export interface ChatConfig {
  api?: string;
  modelName?: string;
  initialMessages?: ChatMessage[];
  stream?: boolean;
  maxLength?: number;
  placeholder?: string;
  enableVoice?: boolean;
  enableAttachments?: boolean;
  enablePrompts?: boolean;
  onError?: (err: Error) => void;
}


export interface ChatHandlers {
  [key: string]: (...args: any[]) => any;
}
