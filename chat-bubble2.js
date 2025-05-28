(function () {
  'use strict';

  window.NotifyChatBubble = {
    initialize: async (config = {}) => {
      const scriptTag = document.currentScript;
      const defaults = {
        userId: scriptTag?.getAttribute('data-user-id') || 'notify',
        sessionId: scriptTag?.getAttribute('data-session-id') || 'notify',
        bgColor: scriptTag?.getAttribute('data-bg-color') || '#52DD69',
        textColor: scriptTag?.getAttribute('data-text-color') || '#FFFFFF',
        logoUrl: scriptTag?.getAttribute('data-logo-url') || '',
        baseUrl: scriptTag?.getAttribute('data-base-url') || 'https://notify-web-assistant-api.beagile.africa',
        customStyles: '',
      };
      const settings = { ...defaults, ...config };

      function loadScript(src, fallbackSrc) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = resolve;
          script.onerror = () => {
            console.warn(`Failed to load script: ${src}. Trying fallback...`);
            if (fallbackSrc) {
              const fallbackScript = document.createElement('script');
              fallbackScript.src = fallbackSrc;
              fallbackScript.async = true;
              fallbackScript.onload = resolve;
              fallbackScript.onerror = () => reject(new Error(`Failed to load fallback script: ${fallbackSrc}`));
              document.head.appendChild(fallbackScript);
            } else {
              reject(new Error(`Failed to load script: ${src}`));
            }
          };
          document.head.appendChild(script);
        });
      }

      function addStyles() {
        const style = document.createElement('style');
        style.setAttribute('data-notify-chat', '');
        style.textContent = settings.customStyles || `
          [data-notify-chat] .fixed { position: fixed; }
          [data-notify-chat] .bottom-6 { bottom: 1.5rem; }
          [data-notify-chat] .right-6 { right: 1.5rem; }
          [data-notify-chat] .bottom-0 { bottom: 0; }
          [data-notify-chat] .right-0 { right: 0; }
          [data-notify-chat] .flex { display: flex; }
          [data-notify-chat] .items-center { align-items: center; }
          [data-notify-chat] .justify-center { justify-content: center; }
          [data-notify-chat] .justify-between { justify-content: space-between; }
          [data-notify-chat] .justify-end { justify-content: flex-end; }
          [data-notify-chat] .justify-start { justify-content: flex-start; }
          [data-notify-chat] .flex-col { flex-direction: column; }
          [data-notify-chat] .rounded-full { border-radius: 9999px; }
          [data-notify-chat] .rounded-lg { border-radius: 0.5rem; }
          [data-notify-chat] .rounded-t-lg { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
          [data-notify-chat] .rounded-2xl { border-radius: 1rem; }
          [data-notify-chat] .rounded-br-none { border-bottom-right-radius: 0; }
          [data-notify-chat] .rounded-bl-none { border-bottom-left-radius: 0; }
          [data-notify-chat] .bg-green-600 { background-color: ${settings.bgColor}; }
          [data-notify-chat] .bg-green-200 { background-color: ${settings.bgColor}33; }
          [data-notify-chat] .bg-white { background-color: #FFFFFF; }
          [data-notify-chat] .bg-gray-100 { background-color: #F3F4F6; }
          [data-notify-chat] .bg-green-50 { background-color: #ECFDF5; }
          [data-notify-chat] .bg-gray-400 { background-color: #9CA3AF; }
          [data-notify-chat] .bg-gray-900 { background-color: #111827; }
          [data-notify-chat] .bg-green-500 { background-color: #10B981; }
          [data-notify-chat] .text-white { color: ${settings.textColor}; }
          [data-notify-chat] .text-green-800 { color: #065F46; }
          [data-notify-chat] .text-green-900 { color: #064E3B; }
          [data-notify-chat] .text-green-600 { color: #059669; }
          [data-notify-chat] .text-gray-800 { color: #1F2937; }
          [data-notify-chat] .text-gray-500 { color: #6B7280; }
          [data-notify-chat] .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
          [data-notify-chat] .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
          [data-notify-chat] .w-16 { width: 4rem; }
          [data-notify-chat] .h-16 { height: 4rem; }
          [data-notify-chat] .w-full { width: 100%; }
          [data-notify-chat] .h-full { height: 100%; }
          [data-notify-chat] .w-7 { width: 1.75rem; }
          [data-notify-chat] .h-7 { height: 1.75rem; }
          [data-notify-chat] .w-8 { width: 2rem; }
          [data-notify-chat] .h-8 { height: 2rem; }
          [data-notify-chat] .w-12 { width: 3rem; }
          [data-notify-chat] .h-12 { height: 3rem; }
          [data-notify-chat] .w-5 { width: 1.25rem; }
          [data-notify-chat] .h-5 { height: 1.25rem; }
          [data-notify-chat] .w-2 { width: 0.5rem; }
          [data-notify-chat] .h-2 { height: 0.5rem; }
          [data-notify-chat] .max-w-\\[75\\%\\] { max-width: 75%; }
          [data-notify-chat] .z-50 { z-index: 50; }
          [data-notify-chat] .z-40 { z-index: 40; }
          [data-notify-chat] .p-4 { padding: 1rem; }
          [data-notify-chat] .p-3 { padding: 0.75rem; }
          [data-notify-chat] .p-2 { padding: 0.5rem; }
          [data-notify-chat] .p-1 { padding: 0.25rem; }
          [data-notify-chat] .px-4 { padding-left: 1rem; padding-right: 1rem; }
          [data-notify-chat] .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          [data-notify-chat] .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
          [data-notify-chat] .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          [data-notify-chat] .pl-4 { padding-left: 1rem; }
          [data-notify-chat] .ml-3 { margin-left: 0.75rem; }
          [data-notify-chat] .ml-2 { margin-left: 0.5rem; }
          [data-notify-chat] .mr-2 { margin-right: 0.5rem; }
          [data-notify-chat] .mt-1 { margin-top: 0.25rem; }
          [data-notify-chat] .mt-4 { margin-top: 1rem; }
          [data-notify-chat] .my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
          [data-notify-chat] .space-y-4 > * + * { margin-top: 1rem; }
          [data-notify-chat] .space-y-2 > * + * { margin-top: 0.5rem; }
          [data-notify-chat] .gap-2 { gap: 0.5rem; }
          [data-notify-chat] .text-sm { font-size: 0.875rem; }
          [data-notify-chat] .text-xs { font-size: 0.75rem; }
          [data-notify-chat] .text-xl { font-size: 1.25rem; }
          [data-notify-chat] .font-bold { font-weight: 700; }
          [data-notify-chat] .font-medium { font-weight: 500; }
          [data-notify-chat] .text-left { text-align: left; }
          [data-notify-chat] .text-right { text-align: right; }
          [data-notify-chat] .text-center { text-align: center; }
          [data-notify-chat] .inline-block { display: inline-block; }
          [data-notify-chat] .overflow-hidden { overflow: hidden; }
          [data-notify-chat] .overflow-auto { overflow: auto; }
          [data-notify-chat] .relative { position: relative; }
          [data-notify-chat] .border { border-width: 1px; }
          [data-notify-chat] .border-2 { border-width: 2px; }
          [data-notify-chat] .border-t { border-top-width: 1px; }
          [data-notify-chat] .border-white { border-color: #FFFFFF; }
          [data-notify-chat] .border-green-100 { border-color: #D1FAE5; }
          [data-notify-chat] .border-gray-100 { border-color: #F3F4F6; }
          [data-notify-chat] .border-gray-200 { border-color: #E5E7EB; }
          [data-notify-chat] .flex-1 { flex: 1 1 0%; }
          [data-notify-chat] .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
          [data-notify-chat] .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
          [data-notify-chat] .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
          [data-notify-chat] .duration-300 { transition-duration: 300ms; }
          [data-notify-chat] .hover\\:bg-green-700:hover { background-color: #047857; }
          [data-notify-chat] .hover\\:bg-white\\/40:hover { background-color: rgba(255, 255, 255, 0.4); }
          [data-notify-chat] .hover\\:bg-gray-50:hover { background-color: #F9FAFB; }
          [data-notify-chat] .hover\\:text-gray-700:hover { color: #374151; }
          [data-notify-chat] .hover\\:scale-105:hover { transform: scale(1.05); }
          [data-notify-chat] .hover\\:underline:hover { text-decoration: underline; }
          [data-notify-chat] .pointer-events-none { pointer-events: none; }
          [data-notify-chat] .bg-transparent { background-color: transparent; }
          [data-notify-chat] .border-none { border-style: none; }
          [data-notify-chat] .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
          [data-notify-chat] .bg-white\\/20 { background-color: rgba(255, 255, 255, 0.2); }
          [data-notify-chat] .order-1 { order: 1; }
          [data-notify-chat] .order-2 { order: 2; }
          [data-notify-chat] .opacity-100 { opacity: 1; }
          [data-notify-chat] .opacity-0 { opacity: 0; }
          [data-notify-chat] .animate-bounce {
            animation: bounce 1s infinite;
          }
          [data-notify-chat] @keyframes bounce {
            0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
            50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
          }
          [data-notify-chat] @media (min-width: 640px) {
            .md\\:bottom-24 { bottom: 6rem; }
            .md\\:right-6 { right: 1.5rem; }
            .md\\:w-\\[400px\\] { width: 400px; }
            .md\\:rounded-lg { border-radius: 0.5rem; }
            .md\\:h-\\[80vh\\] { height: 80vh; }
            .md\\:h-0 { height: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      function displayFallbackUI() {
        const container = document.createElement('div');
        container.id = 'notify-chat-fallback';
        container.innerHTML = `
          <div class="[data-notify-chat] fixed bottom-6 right-6 bg-gray-200 text-gray-800 p-4 rounded-lg">
            Chat is unavailable. Please try again later or contact support.
          </div>
        `;
        document.body.appendChild(container);
      }

      function initApp(settings) {
        const React = window.React;
        const ReactDOM = window.ReactDOM;
        const { useState, useEffect, useRef, forwardRef } = React;

        function cn(...classes) {
          return classes.filter(Boolean).join(' ');
        }

        const Send = (props) => (
          React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            ...props
          }, [
            React.createElement('path', { d: "m22 2-7 20-4-9-9-4Z", key: "1" }),
            React.createElement('path', { d: "M22 2 11 13", key: "2" })
          ])
        );

        const X = (props) => (
          React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            ...props
          }, [
            React.createElement('path', { d: "M18 6 6 18", key: "1" }),
            React.createElement('path', { d: "m6 6 12 12", key: "2" })
          ])
        );

        const MessageCircle = (props) => (
          React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            ...props
          }, [
            React.createElement('path', { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z", key: "1" })
          ])
        );

        const SmileIcon = (props) => (
          React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            ...props
          }, [
            React.createElement('circle', { cx: "12", cy: "12", r: "10", key: "1" }),
            React.createElement('path', { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "2" }),
            React.createElement('line', { x1: "9", y1: "9", x2: "9.01", y2: "9", key: "3" }),
            React.createElement('line', { x1: "15", y1: "9", x2: "15.01", y2: "9", key: "4" })
          ])
        );

        const Avatar = ({ className, children, ...props }) => (
          React.createElement('div', {
            className: `[data-notify-chat] relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`,
            ...props
          }, children)
        );

        const AvatarImage = ({ src, alt = "", className, ...props }) => (
          React.createElement('img', {
            className: `[data-notify-chat] aspect-square h-full w-full ${className || ''}`,
            src,
            alt,
            ...props
          })
        );

        const AvatarFallback = ({ className, children, ...props }) => (
          React.createElement('div', {
            className: `[data-notify-chat] flex h-full w-full items-center justify-center rounded-full ${className || ''}`,
            ...props
          }, children)
        );

        const ScrollArea = forwardRef(({ className, children, ...props }, ref) => (
          React.createElement('div', {
            ref,
            className: cn("[data-notify-chat] relative overflow-hidden", className),
            ...props
          }, 
            React.createElement('div', { 
              className: "[data-notify-chat] h-full w-full overflow-auto" 
            }, children)
          )
        ));
        ScrollArea.displayName = 'ScrollArea';

        const ChatBubble = window.NotifyChatBubble.ChatBubble = () => {
          const [isChatOpen, setIsChatOpen] = useState(false);
          const [message, setMessage] = useState('');
          const [messages, setMessages] = useState([
            { text: 'Hello! Welcome. How can I assist you today? Select an option below or write me a message directly:', sender: 'bot' }
          ]);
          const [isLoading, setIsLoading] = useState(false);
          const messagesEndRef = useRef(null);
          const chatWindowRef = useRef(null);
          const [showQuickOptions, setShowQuickOptions] = useState(true);

          const toggleChat = () => {
            console.log('Toggling chat, current state:', isChatOpen);
            setIsChatOpen(!isChatOpen);
            if (!isChatOpen) {
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
            handleResize();

            if (isChatOpen && chatWindowRef.current) {
              const input = chatWindowRef.current.querySelector('input');
              input?.focus();
              console.log('Chat opened, focusing input');
            }

            return () => window.removeEventListener('resize', handleResize);
          }, [isChatOpen]);

          const sendMessage = async (text) => {
            const messageToSend = text || message;
            if (!messageToSend.trim()) return;

            console.log('Sending message:', messageToSend);
            setShowQuickOptions(false);
            setMessages(prev => [...prev, { text: messageToSend, sender: 'user' }]);
            setMessage('');
            setIsLoading(true);

            try {
              const res = await fetch(`${settings.baseUrl}/v1/message`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-User-ID': settings.userId
                },
                body: JSON.stringify({
                  max_tokens: 200,
                  message: messageToSend,
                  session_id: settings.sessionId,
                  temperature: 0.7,
                  user_id: settings.userId,
                  role: 'user'
                })
              });

              const data = await res.json();
              console.log('API response:', data);

              if (data.message) {
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
                let errorMsg = 'Oops! An error has occurred. Let me communicate this error to my developers and will notify you in a bit';
                if (data.detail) {
                  errorMsg = 'Error: ' + (Array.isArray(data.detail) ? data.detail.map(e => e.msg).join(', ') : data.detail);
                }
                setMessages(prev => [...prev, { text: errorMsg, sender: 'bot' }]);
              }
            } catch (e) {
              console.error('Failed to send message:', e);
              setMessages(prev => [...prev, { text: 'Failed to send message, please try again.', sender: 'bot' }]);
            } finally {
              setIsLoading(false);
            }
          };

          const handleQuickOption = (option) => {
            console.log('Quick option selected:', option);
            sendMessage(option);
          };

          const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          };

          const formatTime = () => {
            const now = new Date();
            return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          };

          return React.createElement(React.Fragment, null, [
            React.createElement('button', {
              className: "[data-notify-chat] fixed bottom-6 right-6 bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-green-700 transition-transform hover:scale-105 z-50",
              onClick: toggleChat,
              onKeyDown: (e) => e.key === 'Enter' && toggleChat(),
              'aria-label': "Toggle chat window",
              role: "button",
              tabIndex: 0,
              key: "bubble-button"
            }, React.createElement(MessageCircle, { className: "[data-notify-chat] w-7 h-7" })),

            React.createElement('div', {
              ref: chatWindowRef,
              className: `[data-notify-chat] fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[400px] bg-white rounded-t-lg md:rounded-lg shadow-xl flex flex-col z-40 transition-all duration-300 ${
                isChatOpen ? 'opacity-100 h-[85vh] md:h-[80vh]' : 'opacity-0 h-0 md:h-0 pointer-events-none'
              }`,
              style: { maxHeight: '85vh' },
              'aria-hidden': !isChatOpen,
              key: "chat-window"
            }, [
              React.createElement('div', { 
                className: "[data-notify-chat] bg-green-200 p-4 rounded-t-lg",
                key: "chat-header"
              }, 
                React.createElement('div', { className: "[data-notify-chat] flex items-center justify-between" }, [
                  React.createElement('div', { className: "[data-notify-chat] flex items-center", key: "avatar-container" }, [
                    React.createElement(Avatar, { className: "[data-notify-chat] h-12 w-12 border-2 border-white", key: "avatar" }, [
                      React.createElement(AvatarImage, { src: settings.logoUrl, alt: "Support", key: "avatar-img" }),
                      React.createElement(AvatarFallback, { className: "[data-notify-chat] bg-green-600 text-white", key: "avatar-fallback" }, "E")
                    ]),
                    React.createElement('div', { className: "[data-notify-chat] ml-3", key: "header-text" }, [
                      React.createElement('div', { className: "[data-notify-chat] text-sm text-green-800", key: "support-text" }, "Chat with Support Team"),
                      React.createElement('div', { className: "[data-notify-chat] text-xl font-bold text-green-900 flex items-center", key: "online-status" }, [
                        "Elina is Online ",
                        React.createElement('span', { className: "[data-notify-chat] w-2 h-2 bg-green-500 rounded-full inline-block ml-2", key: "status-dot" })
                      ])
                    ])
                  ]),
                  React.createElement('button', {
                    onClick: toggleChat,
                    onKeyDown: (e) => e.key === 'Enter' && toggleChat(),
                    className: "[data-notify-chat] w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors",
                    'aria-label': "Close chat",
                    role: "button",
                    tabIndex: 0,
                    key: "close-button"
                  }, React.createElement(X, { className: "[data-notify-chat] w-5 h-5 text-green-900" }))
                ])
              ),

              React.createElement(ScrollArea, { 
                className: "[data-notify-chat] flex-1 p-4 bg-white",
                key: "messages-container"
              }, 
                React.createElement('div', { className: "[data-notify-chat] space-y-4" }, [
                  ...messages.map((msg, index) => 
                    React.createElement('div', { key: index }, 
                      msg.sender === 'system' 
                        ? React.createElement('div', { className: "[data-notify-chat] flex justify-center my-6" }, 
                            React.createElement('div', { className: "[data-notify-chat] text-xs text-green-600 bg-green-50 px-4 py-1 rounded-full border border-green-100 flex items-center" }, [
                              React.createElement('span', { className: "[data-notify-chat] mr-2", key: "check" }, "✓"),
                              msg.text
                            ])
                          )
                        : React.createElement('div', { className: `[data-notify-chat] flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2` }, [
                            msg.sender === 'bot' && React.createElement(Avatar, { className: "[data-notify-chat] h-8 w-8", key: "bot-avatar" }, 
                              React.createElement(AvatarFallback, { className: "[data-notify-chat] bg-green-600 text-white text-xs" }, "E")
                            ),
                            React.createElement('div', { 
                              className: `[data-notify-chat] max-w-[75%] ${msg.sender === 'user' ? 'order-1' : 'order-2'}`,
                              key: "message-bubble"
                            }, [
                              React.createElement('div', { 
                                className: `[data-notify-chat] rounded-2xl p-4 ${
                                  msg.sender === 'user' 
                                    ? 'bg-green-600 text-white rounded-br-none' 
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                }`,
                                key: "message-text"
                              }, msg.text),
                              React.createElement('div', { 
                                className: `[data-notify-chat] text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`,
                                key: "message-time"
                              }, `${msg.sender === 'bot' ? 'Elina • ' : ''}${formatTime()}`)
                            ]),
                            msg.sender === 'user' && React.createElement(Avatar, { className: "[data-notify-chat] h-8 w-8 order-2", key: "user-avatar" }, 
                              React.createElement(AvatarFallback, { className: "[data-notify-chat] bg-gray-400 text-white text-xs" }, "U")
                            )
                          ])
                    )
                  ),
                  showQuickOptions && React.createElement('div', { className: "[data-notify-chat] space-y-2 mt-4", key: "quick-options" }, [
                    React.createElement('button', {
                      onClick: () => handleQuickOption("Chat with Support"),
                      onKeyDown: (e) => e.key === 'Enter' && handleQuickOption("Chat with Support"),
                      className: "[data-notify-chat] w-full text-left py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                      role: "button",
                      tabIndex: 0,
                      key: "option-1"
                    }, "Chat with Support"),
                    React.createElement('button', {
                      onClick: () => handleQuickOption("What hours are you available?"),
                      onKeyDown: (e) => e.key === 'Enter' && handleQuickOption("What hours are you available?"),
                      className: "[data-notify-chat] w-full text-left py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                      role: "button",
                      tabIndex: 0,
                      key: "option-2"
                    }, "What hours are you available?"),
                    React.createElement('button', {
                      onClick: () => handleQuickOption("Where can I find pricing information?"),
                      onKeyDown: (e) => e.key === 'Enter' && handleQuickOption("Where can I find pricing information?"),
                      className: "[data-notify-chat] w-full text-left py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                      role: "button",
                      tabIndex: 0,
                      key: "option-3"
                    }, "Where can I find pricing information?")
                  ]),
                  isLoading && React.createElement('div', { className: "[data-notify-chat] flex items-end gap-2", key: "loading-indicator" }, [
                    React.createElement(Avatar, { className: "[data-notify-chat] h-8 w-8" }, 
                      React.createElement(AvatarFallback, { className: "[data-notify-chat] bg-green-600 text-white text-xs" }, "E")
                    ),
                    React.createElement('div', { className: "[data-notify-chat] bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none" }, 
                      React.createElement('div', { className: "[data-notify-chat] flex gap-2" }, [
                        React.createElement('div', { className: "[data-notify-chat] w-2 h-2 bg-gray-400 rounded-full animate-bounce", key: "dot-1" }),
                        React.createElement('div', { 
                          className: "[data-notify-chat] w-2 h-2 bg-gray-400 rounded-full animate-bounce", 
                          style: { animationDelay: '0.2s' },
                          key: "dot-2"
                        }),
                        React.createElement('div', { 
                          className: "[data-notify-chat] w-2 h-2 bg-gray-400 rounded-full animate-bounce", 
                          style: { animationDelay: '0.4s' },
                          key: "dot-3"
                        })
                      ])
                    )
                  ]),
                  React.createElement('div', { ref: messagesEndRef, key: "messages-end" })
                ])
              ),

              React.createElement('div', { 
                className: "[data-notify-chat] p-4 border-t border-gray-100",
                key: "chat-input"
              }, 
                React.createElement('div', { className: "[data-notify-chat] bg-gray-100 rounded-full p-1 pl-4 flex items-center" }, [
                  React.createElement('input', {
                    type: "text",
                    placeholder: "Write a message...",
                    className: "[data-notify-chat] flex-1 bg-transparent border-none text-gray-800 focus:outline-none text-sm",
                    value: message,
                    onChange: (e) => {
                      setMessage(e.target.value);
                      console.log('Input changed:', e.target.value);
                    },
                    onKeyPress: (e) => {
                      console.log('Key pressed:', e.key);
                      handleKeyPress(e);
                    },
                    onFocus: () => console.log('Input focused'),
                    'aria-label': "Message input",
                    key: "message-input"
                  }),
                  React.createElement('div', { className: "[data-notify-chat] flex items-center", key: "input-buttons" }, [
                    React.createElement('button', { 
                      className: "[data-notify-chat] p-2 text-gray-500 hover:text-gray-700 rounded-full",
                      'aria-label': "Add emoji",
                      role: "button",
                      tabIndex: 0,
                      key: "smile-button"
                    }, 
                      React.createElement(SmileIcon, { className: "[data-notify-chat] w-5 h-5" })
                    ),
                    React.createElement('button', {
                      className: "[data-notify-chat] bg-gray-900 text-white p-3 rounded-full flex items-center justify-center",
                      onClick: () => sendMessage(),
                      onKeyDown: (e) => e.key === 'Enter' && sendMessage(),
                      disabled: !message.trim(),
                      'aria-label': "Send message",
                      role: "button",
                      tabIndex: 0,
                      key: "send-button"
                    }, 
                      React.createElement(Send, { className: "[data-notify-chat] w-5 h-5" })
                    )
                  ])
                ])
              ),

              React.createElement('div', { 
                className: "[data-notify-chat] px-4 py-2 text-xs text-center text-gray-500 border-t border-gray-100",
                key: "chat-footer"
              }, [
                "Powered By ",
                React.createElement('a', {
                  href: "https://notify.africa/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "[data-notify-chat] text-green-600 font-medium hover:underline",
                  key: "footer-link"
                }, "Notify Africa")
              ])
            ])
          ]);
        };

        const container = document.createElement('div');
        container.id = 'notify-chat-bubble-container';
        document.body.appendChild(container);

        let shadow;
        try {
          shadow = container.attachShadow({ mode: 'open' });
          console.log('Using Shadow DOM for chat bubble');
        } catch (e) {
          console.warn('Shadow DOM not supported, using regular DOM:', e);
          shadow = container;
        }

        const style = document.createElement('style');
        style.setAttribute('data-notify-chat', '');
        style.textContent = settings.customStyles || `
          :host { all: initial; }
          ${style.textContent}
        `;
        shadow.appendChild(style);

        const reactRoot = document.createElement('div');
        shadow.appendChild(reactRoot);
        try {
          ReactDOM.render(React.createElement(ChatBubble, settings), reactRoot);
          console.log('Chat bubble rendered successfully');
        } catch (e) {
          console.error('Failed to render React component:', e);
          displayFallbackUI();
        }
      }

      window.NotifyChatBubble.mount = (selector, config) => {
        const target = document.querySelector(selector);
        if (!target) {
          console.error('Target element not found:', selector);
          return;
        }
        if (target.querySelector('#notify-chat-bubble-container')) {
          console.warn('Chat bubble already mounted in target:', selector);
          return;
        }
        addStyles();
        loadScript('https://unpkg.com/react@18/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js')
          .then(() => loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'))
          .then(() => {
            if (!window.React || !window.ReactDOM) {
              throw new Error('React or ReactDOM not loaded correctly.');
            }
            const reactRoot = document.createElement('div');
            target.appendChild(reactRoot);
            window.ReactDOM.render(
              window.React.createElement(window.NotifyChatBubble.ChatBubble, config),
              reactRoot
            );
            console.log('Chat bubble mounted successfully to:', selector);
          })
          .catch(err => {
            console.error('Failed to load dependencies for mount:', err);
            displayFallbackUI();
          });
      };

      window.NotifyChatBubble.cleanup = () => {
        const container = document.getElementById('notify-chat-bubble-container');
        if (container) container.remove();
        const style = document.querySelector('style[data-notify-chat]');
        if (style) style.remove();
        const fallback = document.getElementById('notify-chat-fallback');
        if (fallback) fallback.remove();
        console.log('Chat bubble cleaned up');
      };

      try {
        if (!window.fetch || !window.Promise) {
          console.error('Unsupported browser: Missing fetch or Promise.');
          displayFallbackUI();
          return;
        }

        if (!window.IntersectionObserver) {
          console.warn('IntersectionObserver not supported, initializing immediately.');
          Promise.all([
            loadScript(
              'https://unpkg.com/react@18/umd/react.production.min.js',
              'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js'
            ),
            loadScript(
              'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
              'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
            ),
          ])
            .then(() => {
              if (!window.React || !window.ReactDOM) {
                throw new Error('React or ReactDOM not loaded correctly.');
              }
              addStyles();
              initApp(settings);
            })
            .catch(err => {
              console.error('Failed to load dependencies:', err);
              displayFallbackUI();
            });
          return;
        }

        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              console.log('Chat bubble placeholder intersected, loading dependencies...');
              Promise.all([
                loadScript(
                  'https://unpkg.com/react@18/umd/react.production.min.js',
                  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js'
                ),
                loadScript(
                  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
                  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
                ),
              ])
                .then(() => {
                  if (!window.React || !window.ReactDOM) {
                    throw new Error('React or ReactDOM not loaded correctly.');
                  }
                  console.log('Dependencies loaded, initializing chat bubble...');
                  addStyles();
                  initApp(settings);
                })
                .catch(err => {
                  console.error('Failed to load dependencies:', err);
                  displayFallbackUI();
                });
              observer.disconnect();
            }
          });
        }, { threshold: 0.1 });

        const placeholder = document.createElement('div');
        placeholder.id = 'notify-chat-placeholder';
        placeholder.style.position = 'absolute';
        placeholder.style.bottom = '0';
        placeholder.style.right = '0';
        document.body.appendChild(placeholder);
        observer.observe(placeholder);
      } catch (err) {
        console.error('Failed to initialize chat bubble:', err);
        displayFallbackUI();
      }
    },
  };

  if (document.currentScript) {
    window.NotifyChatBubble.initialize();
  }
})();
