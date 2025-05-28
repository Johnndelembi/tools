declare namespace NotifyChatBubble {
  interface ChatBubbleConfig {
    userId?: string;
    sessionId?: string;
    bgColor?: string;
    textColor?: string;
    logoUrl?: string;
    baseUrl?: string;
    customStyles?: string;
  }

  interface ChatBubbleProps extends ChatBubbleConfig {}

  const ChatBubble: React.ComponentType<ChatBubbleConfig>;
  function initialize(config?: ChatBubbleConfig): void;
  function mount(selector: string, config?: ChatBubbleConfig): void;
  function cleanup(): void;
}

export as namespace NotifyChatBubble;
export = NotifyChatBubble;
