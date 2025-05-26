// Self-initializing ChatBubble Component
(function() {
  'use strict';
  
  // Get script parameters from data attributes
  const scriptTag = document.currentScript;
  const userId = scriptTag.getAttribute('data-user-id') || 'notify';
  const sessionId = scriptTag.getAttribute('data-session-id') || 'notify';
  const bgColor = scriptTag.getAttribute('data-bg-color') || '#52DD69';
  const textColor = scriptTag.getAttribute('data-text-color') || '#FFFFFF';
  const logoUrl = scriptTag.getAttribute('data-logo-url') || '';
  const baseUrl = scriptTag.getAttribute('data-base-url') || 'https://notify-web-assistant-api.beagile.africa';

  // Load React if not already available
  function loadDependencies(callback) {
    // Check if React is already loaded
    if (window.React && window.ReactDOM) {
      callback();
      return;
    }
    
    // Load React and ReactDOM
    const reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.onload = function() {
      const reactDOMScript = document.createElement('script');
      reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
      reactDOMScript.onload = callback;
      document.head.appendChild(reactDOMScript);
    };
    document.head.appendChild(reactScript);
  }

  // Add Tailwind CSS styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Base Tailwind-like styles */
      .fixed { position: fixed; }
      .bottom-6 { bottom: 1.5rem; }
      .right-6 { right: 1.5rem; }
      .bottom-0 { bottom: 0; }
      .right-0 { right: 0; }
      .flex { display: flex; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      .justify-end { justify-content: flex-end; }
      .justify-start { justify-content: flex-start; }
      .flex-col { flex-direction: column; }
      .rounded-full { border-radius: 9999px; }
      .rounded-lg { border-radius: 0.5rem; }
      .rounded-t-lg { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
      .rounded-2xl { border-radius: 1rem; }
      .rounded-br-none { border-bottom-right-radius: 0; }
      .rounded-bl-none { border-bottom-left-radius: 0; }
      .bg-green-600 { background-color: #52DD69; }
      .bg-green-200 { background-color: #52DD69; }
      .bg-white { background-color: #FFFFFF; }
      .bg-gray-100 { background-color: #F3F4F6; }
      .bg-green-50 { background-color: #ECFDF5; }
      .bg-gray-400 { background-color: #9CA3AF; }
      .bg-gray-900 { background-color: #111827; }
      .bg-green-500 { background-color: #10B981; }
      .text-white { color: #FFFFFF; }
      .text-green-800 { color: #065F46; }
      .text-green-900 { color: #064E3B; }
      .text-green-600 { color: #059669; }
      .text-gray-800 { color: #1F2937; }
      .text-gray-500 { color: #6B7280; }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
      .w-16 { width: 4rem; }
      .h-16 { height: 4rem; }
      .w-full { width: 100%; }
      .h-full { height: 100%; }
      .w-7 { width: 1.75rem; }
      .h-7 { height: 1.75rem; }
      .w-8 { width: 2rem; }
      .h-8 { height: 2rem; }
      .w-12 { width: 3rem; }
      .h-12 { height: 3rem; }
      .w-5 { width: 1.25rem; }
      .h-5 { height: 1.25rem; }
      .w-2 { width: 0.5rem; }
      .h-2 { height: 0.5rem; }
      .max-w-\\[75\\%\\] { max-width: 75%; }
      .z-50 { z-index: 50; }
      .z-40 { z-index: 40; }
      .p-4 { padding: 1rem; }
      .p-3 { padding: 0.75rem; }
      .p-2 { padding: 0.5rem; }
      .p-1 { padding: 0.25rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .pl-4 { padding-left: 1rem; }
      .ml-3 { margin-left: 0.75rem; }
      .ml-2 { margin-left: 0.5rem; }
      .mr-2 { margin-right: 0.5rem; }
      .mt-1 { margin-top: 0.25rem; }
      .mt-4 { margin-top: 1rem; }
      .my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
      .space-y-4 > * + * { margin-top: 1rem; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .gap-2 { gap: 0.5rem; }
      .text-sm { font-size: 0.875rem; }
      .text-xs { font-size: 0.75rem; }
      .text-xl { font-size: 1.25rem; }
      .font-bold { font-weight: 700; }
      .font-medium { font-weight: 500; }
      .text-left { text-align: left; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      .inline-block { display: inline-block; }
      .overflow-hidden { overflow: hidden; }
      .overflow-auto { overflow: auto; }
      .relative { position: relative; }
      .border { border-width: 1px; }
      .border-2 { border-width: 2px; }
      .border-t { border-top-width: 1px; }
      .border-white { border-color: #FFFFFF; }
      .border-green-100 { border-color: #D1FAE5; }
      .border-gray-100 { border-color: #F3F4F6; }
      .border-gray-200 { border-color: #E5E7EB; }
      .flex-1 { flex: 1 1 0%; }
      .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .duration-300 { transition-duration: 300ms; }
      .hover\\:bg-green-700:hover { background-color: #047857; }
      .hover\\:bg-white\\/40:hover { background-color: rgba(255, 255, 255, 0.4); }
      .hover\\:bg-gray-50:hover { background-color: #F9FAFB; }
      .hover\\:text-gray-700:hover { color: #374151; }
      .hover\\:scale-105:hover { transform: scale(1.05); }
      .hover\\:underline:hover { text-decoration: underline; }
      .pointer-events-none { pointer-events: none; }
      .bg-transparent { background-color: transparent; }
      .border-none { border-style: none; }
      .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
      .bg-white\\/20 { background-color: rgba(255, 255, 255, 0.2); }
      .order-1 { order: 1; }
      .order-2 { order: 2; }
      .opacity-100 { opacity: 1; }
      .opacity-0 { opacity: 0; }
      
      /* Animations */
      .animate-bounce {
        animation: bounce 1s infinite;
      }
      @keyframes bounce {
        0%, 100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
      
      /* Media queries */
      @media (min-width: 640px) {
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

  // Initialize the app
  function initApp() {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const { useState, useEffect, useRef, forwardRef } = React;

    // Utility function for class name merging
    function cn(...classes) {
      return classes.filter(Boolean).join(' ');
    }

    // Icons implementation
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

    // Avatar Component
    const Avatar = ({ className, children, ...props }) => (
      React.createElement('div', {
        className: `relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`,
        ...props
      }, children)
    );

    const AvatarImage = ({ src, alt = "", className, ...props }) => (
      React.createElement('img', {
        className: `aspect-square h-full w-full ${className || ''}`,
        src,
        alt,
        ...props
      })
    );

    const AvatarFallback = ({ className, children, ...props }) => (
      React.createElement('div', {
        className: `flex h-full w-full items-center justify-center rounded-full ${className || ''}`,
        ...props
      }, children)
    );

    // ScrollArea Component
    const ScrollArea = forwardRef(({ className, children, ...props }, ref) => (
      React.createElement('div', {
        ref,
        className: cn("relative overflow-hidden", className),
        ...props
      }, 
        React.createElement('div', { 
          className: "h-full w-full overflow-auto" 
        }, children)
      )
    ));
    ScrollArea.displayName = 'ScrollArea';

    // Main ChatBubble Component
    const ChatBubble = () => {
      const [isChatOpen, setIsChatOpen] = useState(false);
      const [message, setMessage] = useState('');
      const [messages, setMessages] = useState([
        { text: 'Hello!  Welcome. How can I assist you today? Select an option below or write me a message directly:', sender: 'bot' }
      ]);
      const [isLoading, setIsLoading] = useState(false);
      const messagesEndRef = useRef(null);
      const chatWindowRef = useRef(null);
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

      const sendMessage = async (text) => {
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
              errorMsg = 'Error: ' + (Array.isArray(data.detail) ? data.detail.map((e) => e.msg).join(', ') : data.detail);
            }
            setMessages(prev => [...prev, { text: errorMsg, sender: 'bot' }]);
          }
        } catch (e) {
          setMessages(prev => [...prev, { text: 'Failed to send message, Please try sending the message again', sender: 'bot' }]);
        } finally {
          setIsLoading(false);
        }
      };

      const handleQuickOption = (option) => {
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
        // Chat Bubble Button
        React.createElement('button', {
          className: "fixed bottom-6 right-6 bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-green-700 transition-transform hover:scale-105 z-50",
          onClick: toggleChat,
          'aria-label': "Open chat",
          key: "bubble-button"
        }, React.createElement(MessageCircle, { className: "w-7 h-7" })),

        // Chat Window
        React.createElement('div', {
          ref: chatWindowRef,
          className: `fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[400px] bg-white rounded-t-lg md:rounded-lg shadow-xl flex flex-col z-40 transition-all duration-300 ${
            isChatOpen ? 'opacity-100 h-[85vh] md:h-[80vh]' : 'opacity-0 h-0 md:h-0 pointer-events-none'
          }`,
          style: { maxHeight: '85vh' },
          key: "chat-window"
        }, [
          // Chat Header
          React.createElement('div', { 
            className: "bg-green-200 p-4 rounded-t-lg",
            key: "chat-header"
          }, 
            React.createElement('div', { className: "flex items-center justify-between" }, [
              React.createElement('div', { className: "flex items-center", key: "avatar-container" }, [
                React.createElement(Avatar, { className: "h-12 w-12 border-2 border-white", key: "avatar" }, [
                  React.createElement(AvatarImage, { src: logoUrl || "", alt: "Support", key: "avatar-img" }),
                  React.createElement(AvatarFallback, { className: "bg-green-600 text-white", key: "avatar-fallback" }, "E")
                ]),
                React.createElement('div', { className: "ml-3", key: "header-text" }, [
                  React.createElement('div', { className: "text-sm text-green-800", key: "support-text" }, "Chat with Support Team"),
                  React.createElement('div', { className: "text-xl font-bold text-green-900 flex items-center", key: "online-status" }, [
                    "Elina is Online ",
                    React.createElement('span', { className: "w-2 h-2 bg-green-500 rounded-full inline-block ml-2", key: "status-dot" })
                  ])
                ])
              ]),
              React.createElement('button', {
                onClick: toggleChat,
                className: "w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors",
                'aria-label': "Close chat",
                key: "close-button"
              }, React.createElement(X, { className: "w-5 h-5 text-green-900" }))
            ])
          ),

          // Chat Messages
          React.createElement(ScrollArea, { 
            className: "flex-1 p-4 bg-white",
            key: "messages-container"
          }, 
            React.createElement('div', { className: "space-y-4" }, [
              ...messages.map((msg, index) => 
                React.createElement('div', { key: index }, 
                  msg.sender === 'system' 
                    ? React.createElement('div', { className: "flex justify-center my-6" }, 
                        React.createElement('div', { className: "text-xs text-green-600 bg-green-50 px-4 py-1 rounded-full border border-green-100 flex items-center" }, [
                          React.createElement('span', { className: "mr-2", key: "check" }, "✓"),
                          msg.text
                        ])
                      )
                    : React.createElement('div', { className: `flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2` }, [
                        msg.sender === 'bot' && React.createElement(Avatar, { className: "h-8 w-8", key: "bot-avatar" }, 
                          React.createElement(AvatarFallback, { className: "bg-green-600 text-white text-xs" }, "E")
                        ),
                        React.createElement('div', { 
                          className: `max-w-[75%] ${msg.sender === 'user' ? 'order-1' : 'order-2'}`,
                          key: "message-bubble"
                        }, [
                          React.createElement('div', { 
                            className: `rounded-2xl p-4 ${
                              msg.sender === 'user' 
                                ? 'bg-green-600 text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`,
                            key: "message-text"
                          }, msg.text),
                          React.createElement('div', { 
                            className: `text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`,
                            key: "message-time"
                          }, `${msg.sender === 'bot' ? 'Elina • ' : ''}${formatTime()}`)
                        ]),
                        msg.sender === 'user' && React.createElement(Avatar, { className: "h-8 w-8 order-2", key: "user-avatar" }, 
                          React.createElement(AvatarFallback, { className: "bg-gray-400 text-white text-xs" }, "U")
                        )
                      ])
                )
              ),
              
              showQuickOptions && React.createElement('div', { className: "space-y-2 mt-4", key: "quick-options" }, [
                React.createElement('button', {
                  onClick: () => handleQuickOption("Chat with Support"),
                  className: "w-full text-left py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                  key: "option-1"
                }, "Chat with Support"),
                React.createElement('button', {
                  onClick: () => handleQuickOption("What hours are you available?"),
                  className: "w-full text-left py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                  key: "option-2"
                }, "What hours are you available?"),
                React.createElement('button', {
                  onClick: () => handleQuickOption("Where can I find pricing information?"),
                  className: "w-full text-left py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                  key: "option-3"
                }, "Where can I find pricing information?")
              ]),
              
              isLoading && React.createElement('div', { className: "flex items-end gap-2", key: "loading-indicator" }, [
                React.createElement(Avatar, { className: "h-8 w-8" }, 
                  React.createElement(AvatarFallback, { className: "bg-green-600 text-white text-xs" }, "E")
                ),
                React.createElement('div', { className: "bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none" }, 
                  React.createElement('div', { className: "flex gap-2" }, [
                    React.createElement('div', { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", key: "dot-1" }),
                    React.createElement('div', { 
                      className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", 
                      style: { animationDelay: '0.2s' },
                      key: "dot-2"
                    }),
                    React.createElement('div', { 
                      className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", 
                      style: { animationDelay: '0.4s' },
                      key: "dot-3"
                    })
                  ])
                )
              ]),
              
              React.createElement('div', { ref: messagesEndRef, key: "messages-end" })
            ])
          ),

          // Chat Input
          React.createElement('div', { 
            className: "p-4 border-t border-gray-100",
            key: "chat-input"
          }, 
            React.createElement('div', { className: "bg-gray-100 rounded-full p-1 pl-4 flex items-center" }, [
              React.createElement('input', {
                type: "text",
                placeholder: "Write a message...",
                className: "flex-1 bg-transparent border-none text-gray-800 focus:outline-none text-sm",
                value: message,
                onChange: (e) => setMessage(e.target.value),
                onKeyPress: handleKeyPress,
                key: "message-input"
              }),
              React.createElement('div', { className: "flex items-center", key: "input-buttons" }, [
                React.createElement('button', { 
                  className: "p-2 text-gray-500 hover:text-gray-700 rounded-full",
                  key: "smile-button"
                }, 
                  React.createElement(SmileIcon, { className: "w-5 h-5" })
                ),
                React.createElement('button', {
                  className: "bg-gray-900 text-white p-3 rounded-full flex items-center justify-center",
                  onClick: () => sendMessage(),
                  disabled: !message.trim(),
                  key: "send-button"
                }, 
                  React.createElement(Send, { className: "w-5 h-5" })
                )
              ])
            ])
          ),

          // Chat Footer
          React.createElement('div', { 
            className: "px-4 py-2 text-xs text-center text-gray-500 border-t border-gray-100",
            key: "chat-footer"
          }, [
            "Powered By ",
            React.createElement('a', {
              href: "https://notify.africa/",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-green-600 font-medium hover:underline",
              key: "footer-link"
            }, "Notify Africa")
          ])
        ])
      ]);
    };

    // Create container and render component
    const chatContainer = document.createElement('div');
    chatContainer.id = 'notify-chat-bubble-container';
    document.body.appendChild(chatContainer);
    
    ReactDOM.render(React.createElement(ChatBubble), chatContainer);
  }

  // Add styles and load dependencies
  addStyles();
  loadDependencies(initApp);
})();
