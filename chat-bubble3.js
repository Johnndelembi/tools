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

      // Validate colors to prevent CSS errors
      function isValidHexColor(color) {
        return /^#[0-9A-Fa-f]{6}$/.test(color);
      }
      settings.bgColor = isValidHexColor(settings.bgColor) ? settings.bgColor : '#52DD69';
      settings.textColor = isValidHexColor(settings.textColor) ? settings.textColor : '#FFFFFF';

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

      function addStyles(target) {
        try {
          const style = document.createElement('style');
          style.setAttribute('data-notify-chat', '');
          const cssContent = settings.customStyles || `
            [data-notify-chat] .chat-button {
              position: fixed;
              bottom: 1.5rem;
              right: 1.5rem;
              background-color: ${settings.bgColor};
              color: ${settings.textColor};
              border-radius: 50%;
              width: 4rem;
              height: 4rem;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
              cursor: pointer;
              z-index: 50;
            }
            [data-notify-chat] .chat-button:hover {
              background-color: #047857;
              transform: scale(1.05);
            }
            [data-notify-chat] .chat-window {
              position: fixed;
              bottom: 0;
              right: 0;
              width: 100%;
              background-color: #FFFFFF;
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
              box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
              z-index: 40;
              transition: all 0.3s;
            }
            [data-notify-chat] .chat-window.open {
              opacity: 1;
              height: 85vh;
            }
            [data-notify-chat] .chat-window.closed {
              opacity: 0;
              height: 0;
              pointer-events: none;
            }
            [data-notify-chat] .chat-header {
              background-color: ${settings.bgColor}33;
              padding: 1rem;
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            [data-notify-chat] .chat-messages {
              flex: 1;
              padding: 1rem;
              background-color: #FFFFFF;
              overflow-y: auto;
            }
            [data-notify-chat] .chat-input {
              padding: 1rem;
              border-top: 1px solid #E5E7EB;
            }
            [data-notify-chat] .chat-input input {
              flex: 1;
              background: transparent;
              border: none;
              color: #1F2937;
              outline: none;
              font-size: 0.875rem;
            }
            [data-notify-chat] .message {
              max-width: 75%;
              padding: 1rem;
              border-radius: 1rem;
              margin-bottom: 0.5rem;
            }
            [data-notify-chat] .message.user {
              background-color: ${settings.bgColor};
              color: ${settings.textColor};
              margin-left: auto;
              border-bottom-right-radius: 0;
            }
            [data-notify-chat] .message.bot {
              background-color: #F3F4F6;
              color: #1F2937;
              border-bottom-left-radius: 0;
            }
            [data-notify-chat] .quick-option {
              width: 100%;
              text-align: left;
              padding: 0.75rem 1rem;
              border: 1px solid #E5E7EB;
              border-radius: 0.5rem;
              cursor: pointer;
              background-color: #FFFFFF;
            }
            [data-notify-chat] .quick-option:hover {
              background-color: #F9FAFB;
            }
            [data-notify-chat] .avatar {
              width: 2rem;
              height: 2rem;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: ${settings.bgColor};
              color: ${settings.textColor};
              font-size: 0.75rem;
            }
            [data-notify-chat] .close-button {
              width: 2rem;
              height: 2rem;
              border-radius: 50%;
              background-color: rgba(255, 255, 255, 0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }
            [data-notify-chat] .close-button:hover {
              background-color: rgba(255, 255, 255, 0.4);
            }
            [data-notify-chat] .loading-dot {
              width: 0.5rem;
              height: 0.5rem;
              background-color: #9CA3AF;
              border-radius: 50%;
              animation: bounce 1s infinite;
            }
            [data-notify-chat] .loading-dot:nth-child(2) { animation-delay: 0.2s; }
            [data-notify-chat] .loading-dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes bounce {
              0%, 100% { transform: translateY(-25%); }
              50% { transform: translateY(0); }
            }
            @media (min-width: 640px) {
              [data-notify-chat] .chat-window {
                bottom: 6rem;
                right: 1.5rem;
                width: 400px;
                border-radius: 0.5rem;
              }
              [data-notify-chat] .chat-window.open {
                height: 80vh;
              }
            }
          `;
          style.textContent = cssContent;
          target.appendChild(style);
          console.log('Styles injected successfully to:', target === document.head ? 'document.head' : 'Shadow DOM');
        } catch (e) {
          console.error('Failed to apply styles:', e);
          displayFallbackUI();
        }
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
        console.log('Displayed fallback UI due to rendering failure');
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
            className: cn("[data-notify-chat] avatar", className),
            ...props
          }, children)
        );

        const AvatarImage = ({ src, alt = "", className, ...props }) => (
          React.createElement('img', {
            className: cn("[data-notify-chat] aspect-square h-full w-full", className),
            src,
            alt,
            ...props
          })
        );

        const AvatarFallback = ({ className, children, ...props }) => (
          React.createElement('div', {
            className: cn("[data-notify-chat] avatar", className),
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
              className: "[data-notify-chat] chat-button",
              onClick: toggleChat,
              onKeyDown: (e) => e.key === 'Enter' && toggleChat(),
              'aria-label': "Toggle chat window",
              role: "button",
              tabIndex: 0,
              key: "bubble-button"
            }, React.createElement(MessageCircle, { style: { width: '1.75rem', height: '1.75rem' } })),

            React.createElement('div', {
              ref: chatWindowRef,
              className: `[data-notify-chat] chat-window ${isChatOpen ? 'open' : 'closed'}`,
              style: { maxHeight: '85vh' },
              'aria-hidden': !isChatOpen,
              key: "chat-window"
            }, [
              React.createElement('div', { 
                className: "[data-notify-chat] chat-header",
                key: "chat-header"
              }, 
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center' }, key: "avatar-container" }, [
                    React.createElement(Avatar, { style: { width: '3rem', height: '3rem', border: '2px solid #FFFFFF' }, key: "avatar" }, [
                      React.createElement(AvatarImage, { src: settings.logoUrl, alt: "Support", key: "avatar-img" }),
                      React.createElement(AvatarFallback, { style: { backgroundColor: settings.bgColor, color: settings.textColor }, key: "avatar-fallback" }, "E")
                    ]),
                    React.createElement('div', { style: { marginLeft: '0.75rem' }, key: "header-text" }, [
                      React.createElement('div', { style: { fontSize: '0.875rem', color: '#065F46' }, key: "support-text" }, "Chat with Support Team"),
                      React.createElement('div', { style: { fontSize: '1.25rem', fontWeight: '700', color: '#064E3B', display: 'flex', alignItems: 'center' }, key: "online-status" }, [
                        "Elina is Online ",
                        React.createElement('span', { style: { width: '0.5rem', height: '0.5rem', backgroundColor: '#10B981', borderRadius: '50%', marginLeft: '0.5rem' }, key: "status-dot" })
                      ])
                    ])
                  ]),
                  React.createElement('button', {
                    onClick: toggleChat,
                    onKeyDown: (e) => e.key === 'Enter' && toggleChat(),
                    className: "[data-notify-chat] close-button",
                    'aria-label': "Close chat",
                    role: "button",
                    tabIndex: 0,
                    key: "close-button"
                  }, React.createElement(X, { style: { width: '1.25rem', height: '1.25rem', color: '#064E3B' } }))
                ])
              ),

              React.createElement(ScrollArea, { 
                className: "[data-notify-chat] chat-messages",
                key: "messages-container"
              }, 
                React.createElement('div', { style: { marginBottom: '1rem' } }, [
                  ...messages.map((msg, index) => 
                    React.createElement('div', { key: index }, 
                      msg.sender === 'system' 
                        ? React.createElement('div', { style: { display: 'flex', justifyContent: 'center', margin: '1.5rem 0' } }, 
                            React.createElement('div', { style: { fontSize: '0.75rem', color: '#059669', backgroundColor: '#ECFDF5', padding: '0.25rem 1rem', borderRadius: '9999px', border: '1px solid #D1FAE5', display: 'flex', alignItems: 'center' } }, [
                              React.createElement('span', { style: { marginRight: '0.5rem' }, key: "check" }, "✓"),
                              msg.text
                            ])
                          )
                        : React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '0.5rem', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' } }, [
                            msg.sender === 'bot' && React.createElement(Avatar, { key: "bot-avatar" }, 
                              React.createElement(AvatarFallback, { style: { backgroundColor: settings.bgColor, color: settings.textColor }, key: "avatar-fallback" }, "E")
                            ),
                            React.createElement('div', { 
                              style: { maxWidth: '75%', order: msg.sender === 'user' ? 1 : 2 },
                              key: "message-bubble"
                            }, [
                              React.createElement('div', { 
                                className: `[data-notify-chat] message ${msg.sender === 'user' ? 'user' : 'bot'}`,
                                key: "message-text"
                              }, msg.text),
                              React.createElement('div', { 
                                style: { fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem', textAlign: msg.sender === 'user' ? 'right' : 'left' },
                                key: "message-time"
                              }, `${msg.sender === 'bot' ? 'Elina • ' : ''}${formatTime()}`)
                            ]),
                            msg.sender === 'user' && React.createElement(Avatar, { style: { order: 2 }, key: "user-avatar" }, 
                              React.createElement(AvatarFallback, { style: { backgroundColor: '#9CA3AF', color: '#FFFFFF' }, key: "avatar-fallback" }, "U")
                            )
                          ])
                    )
                  ),
                  showQuickOptions && React.createElement('div', { style: { marginTop: '1rem' }, key: "quick-options" }, [
                    React.createElement('button', {
                      onClick: () => handleQuickOption("Chat with Support"),
                      onKeyDown: (e) => e.key === 'Enter' && handleQuickOption("Chat with Support"),
                      className: "[data-notify-chat] quick-option",
                      role: "button",
                      tabIndex: 0,
                      key: "option-1"
                    }, "Chat with Support"),
                    React.createElement('button', {
                      onClick: () => handleQuickOption("What hours are you available?"),
                      onKeyDown: (e) => e.key === 'Enter' && handleQuickOption("What hours are you available?"),
                      className: "[data-notify-chat] quick-option",
                      role: "button",
                      tabIndex: 0,
                      key: "option-2"
                    }, "What hours are you available?"),
                    React.createElement('button', {
                      onClick: () => handleQuickOption("Where can I find pricing information?"),
                      onKeyDown: (e) => e.key === 'Enter' && handleQuickOption("Where can I find pricing information?"),
                      className: "[data-notify-chat] quick-option",
                      role: "button",
                      tabIndex: 0,
                      key: "option-3"
                    }, "Where can I find pricing information?")
                  ]),
                  isLoading && React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }, key: "loading-indicator" }, [
                    React.createElement(Avatar, { key: "loading-avatar" }, 
                      React.createElement(AvatarFallback, { style: { backgroundColor: settings.bgColor, color: settings.textColor }, key: "avatar-fallback" }, "E")
                    ),
                    React.createElement('div', { style: { backgroundColor: '#F3F4F6', padding: '0.75rem 1rem', borderRadius: '1rem', borderBottomLeftRadius: '0' } }, 
                      React.createElement('div', { style: { display: 'flex', gap: '0.5rem' } }, [
                        React.createElement('div', { className: "[data-notify-chat] loading-dot", key: "dot-1" }),
                        React.createElement('div', { className: "[data-notify-chat] loading-dot", key: "dot-2" }),
                        React.createElement('div', { className: "[data-notify-chat] loading-dot", key: "dot-3" })
                      ])
                    )
                  ]),
                  React.createElement('div', { ref: messagesEndRef, key: "messages-end" })
                ])
              ),

              React.createElement('div', { 
                className: "[data-notify-chat] chat-input",
                key: "chat-input"
              }, 
                React.createElement('div', { style: { backgroundColor: '#F3F4F6', borderRadius: '9999px', padding: '0.25rem 0.25rem 0.25rem 1rem', display: 'flex', alignItems: 'center' } }, [
                  React.createElement('input', {
                    type: "text",
                    placeholder: "Write a message...",
                    className: "[data-notify-chat] chat-input input",
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
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center' }, key: "input-buttons" }, [
                    React.createElement('button', { 
                      style: { padding: '0.5rem', color: '#6B7280', borderRadius: '50%' },
                      'aria-label': "Add emoji",
                      role: "button",
                      tabIndex: 0,
                      key: "smile-button"
                    }, 
                      React.createElement(SmileIcon, { style: { width: '1.25rem', height: '1.25rem' } })
                    ),
                    React.createElement('button', {
                      style: { backgroundColor: '#111827', color: '#FFFFFF', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
                      onClick: () => sendMessage(),
                      onKeyDown: (e) => e.key === 'Enter' && sendMessage(),
                      disabled: !message.trim(),
                      'aria-label': "Send message",
                      role: "button",
                      tabIndex: 0,
                      key: "send-button"
                    }, 
                      React.createElement(Send, { style: { width: '1.25rem', height: '1.25rem' } })
                    )
                  ])
                ])
              ),

              React.createElement('div', { 
                style: { padding: '0.5rem 1rem', fontSize: '0.75rem', textAlign: 'center', color: '#6B7280', borderTop: '1px solid #E5E7EB' },
                key: "chat-footer"
              }, [
                "Powered By ",
                React.createElement('a', {
                  href: "https://notify.africa/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: { color: '#059669', fontWeight: '500', textDecoration: 'underline' },
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
          addStyles(shadow);
        } catch (e) {
          console.warn('Shadow DOM not supported, using regular DOM:', e);
          shadow = container;
          addStyles(document.head); // Fallback to document.head
        }

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
        addStyles(document.head);
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
              addStyles(document.head);
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
                  addStyles(document.head);
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
