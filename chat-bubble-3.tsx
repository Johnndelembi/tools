import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, PaperclipIcon, SmileIcon, Trash2Icon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Cn
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Scroll Area
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }



// Main chatbot
interface ChatBubbleProps {
  userId?: string;
  sessionId?: string;
  bgColor?: string;
  textColor?: string;
  logoUrl?: string;
  baseUrl?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  userId = 'notify',
  sessionId = 'notify',
  bgColor = '#1E1E2A',
  textColor = '#FFFFFF',
  logoUrl = '',
  baseUrl = 'http://127.0.0.1:8000'
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' | 'system' }>>([
    { text: 'Hello! 👋 Welcome to BiasharaPlus. How can I assist you today? Select an option below or write me a message directly:', sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [showQuickOptions, setShowQuickOptions] = useState(true);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      // Reset quick options when opening chat if no messages from user yet
      const hasUserMessages = messages.some(msg => msg.sender === 'user');
      setShowQuickOptions(!hasUserMessages);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Set initial height and handle resize for mobile
    const handleResize = () => {
      if (chatWindowRef.current) {
        const windowHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 640;
        if (isMobile) {
          chatWindowRef.current.style.height = isChatOpen ? `${windowHeight * 0.85}px` : '0px';
        } else {
          chatWindowRef.current.style.height = isChatOpen ? '80vh' : '0px';
          chatWindowRef.current.style.maxHeight = '85vh';
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial height

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isChatOpen]);

  const sendMessage = async (text?: string) => {
    const messageToSend = text || message;
    if (!messageToSend.trim()) return;
    
    // Hide quick options once user sends a message
    setShowQuickOptions(false);
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: messageToSend, sender: 'user' }]);
    setMessage('');
    
    // Show loading indicator
    setIsLoading(true);
    
    try {
      const res = await fetch(`${baseUrl}/v1/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify({
          max_tokens: 200,
          message: messageToSend,
          session_id: sessionId,
          temperature: 0.7,
          user_id: userId,
          role: 'user'
        })
      });
      
      const data = await res.json();
      
      if (data.message) {
        // Add a "connected with support" message after first user message
        if (messages.filter(m => m.sender === 'user').length === 0) {
          setMessages(prev => [
            ...prev, 
            { text: 'Connected with Assistant', sender: 'system' },
            { text: data.message, sender: 'bot' }
          ]);
        } else {
          setMessages(prev => [...prev, { text: data.message, sender: 'bot' }]);
        }
      } else {
        let errorMsg = 'Oops! An error has occured. Let me communicate this error to my developers and will notify you in a bit';
        if (data.detail) {
          errorMsg = 'Error: ' + (Array.isArray(data.detail) ? data.detail.map((e: any) => e.msg).join(', ') : data.detail);
        }
        setMessages(prev => [...prev, { text: errorMsg, sender: 'bot' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { text: 'Failed to send message, Please try sending the message again', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = (option: string) => {
    sendMessage(option);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-green-700 transition-transform hover:scale-105 z-50"
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className={`fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[400px] bg-white rounded-t-lg md:rounded-lg shadow-xl flex flex-col z-40 transition-all duration-300 ${
          isChatOpen ? 'opacity-100 h-[85vh] md:h-[80vh]' : 'opacity-0 h-0 md:h-0 pointer-events-none'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Chat Header */}
        <div className="bg-green-200 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src="" alt="Support" />
                <AvatarFallback className="bg-green-600 text-white">E</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="text-sm text-green-800">Chat with Support Team</div>
                <div className="text-xl font-bold text-green-900 flex items-center">
                  Elina is Online <span className="w-2 h-2 bg-green-500 rounded-full inline-block ml-2"></span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-green-900" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 bg-white">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.sender === 'system' ? (
                  <div className="flex justify-center my-6">
                    <div className="text-xs text-green-600 bg-green-50 px-4 py-1 rounded-full border border-green-100 flex items-center">
                      <span className="mr-2">✓</span> {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {msg.sender === 'bot' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-600 text-white text-xs">E</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[75%] ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-2xl p-4 ${
                        msg.sender === 'user' 
                          ? 'bg-green-600 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.sender === 'bot' ? 'Elina • ' : ''}{formatTime()}
                      </div>
                    </div>
                    {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8 order-2">
                        <AvatarFallback className="bg-gray-400 text-white text-xs">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {showQuickOptions && (
              <div className="space-y-2 mt-4">
                <button 
                  onClick={() => handleQuickOption("Chat with Support")}
                  className="w-full text-left py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Chat with Support
                </button>
                <button 
                  onClick={() => handleQuickOption("Check Transaction Status")}
                  className="w-full text-left py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Make Subscription Payment
                </button>
                <button 
                  onClick={() => handleQuickOption("Manage Sender IDs")}
                  className="w-full text-left py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Install BiasharaPlus Mobile Application
                </button>
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-end gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-600 text-white text-xs">E</AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-100 rounded-full p-1 pl-4 flex items-center">
            <input
              type="text"
              placeholder="Write a message..."
              className="flex-1 bg-transparent border-none text-gray-800 focus:outline-none text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex items-center">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full">
                <SmileIcon className="w-5 h-5" />
              </button>
              <button
                className="bg-gray-900 text-white p-3 rounded-full flex items-center justify-center"
                onClick={() => sendMessage()}
                disabled={!message.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Footer */}
        <div className="px-4 py-2 text-xs text-center text-gray-500 border-t border-gray-100">
          Powered By{" "}
          <a
            href="https://notify.africa/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-medium hover:underline"
          >
            Notify Africa
          </a>
        </div>
      </div>
    </>
  );
};

export default ChatBubble;
