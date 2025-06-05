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

  // Load dependencies asynchronously
  async function loadDependencies() {
    if (window.React && window.ReactDOM && window.React.version.startsWith('18')) {
      return { React: window.React, ReactDOM: window.ReactDOM };
    }
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };
    await loadScript('https://unpkg.com/react@18/umd/react.production.min.js');
    await loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
    return { React: window.React, ReactDOM: window.ReactDOM };
  }

  // Add scoped styles to Shadow DOM
  function addStyles(shadowRoot) {
    const style = document.createElement('style');
    style.textContent = `
      /* ...existing styles... */
      .notify-fixed { position: fixed; }
      .notify-bottom-6 { bottom: 1.5rem; }
      .notify-right-6 { right: 1.5rem; }
      .notify-bottom-0 { bottom: 0; }
      .notify-right-0 { right: 0; }
      .notify-flex { display: flex; }
      .notify-items-center { align-items: center; }
      .notify-justify-center { justify-content: center; }
      .notify-justify-between { justify-content: space-between; }
      .notify-justify-end { justify-content: flex-end; }
      .notify-justify-start { justify-content: flex-start; }
      .notify-flex-col { flex-direction: column; }
      .notify-rounded-full { border-radius: 9999px; }
      .notify-rounded-lg { border-radius: 0.5rem; }
      .notify-rounded-t-lg { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
      .notify-rounded-2xl { border-radius: 1rem; }
      .notify-rounded-br-none { border-bottom-right-radius: 0; }
      .notify-rounded-bl-none { border-bottom-left-radius: 0; }
      .notify-bg-green-600 { background-color: ${bgColor}; }
      .notify-bg-green-200 { background-color: ${bgColor}; }
      .notify-bg-white { background-color: #FFFFFF; }
      .notify-bg-gray-100 { background-color: #F3F4F6; }
      .notify-bg-green-50 { background-color: #ECFDF5; }
      .notify-bg-gray-400 { background-color: #9CA3AF; }
      .notify-bg-gray-900 { background-color: #111827; }
      .notify-bg-green-500 { background-color: #10B981; }
      .notify-text-white { color: ${textColor}; }
      .notify-text-green-800 { color: #065F46; }
      .notify-text-green-900 { color: #064E3B; }
      .notify-text-green-600 { color: #059669; }
      .notify-text-gray-800 { color: #1F2937; }
      .notify-text-gray-500 { color: #6B7280; }
      .notify-shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      .notify-shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
      .notify-w-16 { width: 4rem; }
      .notify-h-16 { height: 4rem; }
      .notify-w-full { width: 100%; }
      .notify-h-full { height: 100%; }
      .notify-w-7 { width: 1.75rem; }
      .notify-h-7 { height: 1.75rem; }
      .notify-w-8 { width: 2rem; }
      .notify-h-8 { height: 2rem; }
      .notify-w-12 { width: 3rem; }
      .notify-h-12 { height: 3rem; }
      .notify-w-5 { width: 1.25rem; }
      .notify-h-5 { height: 1.25rem; }
      .notify-w-2 { width: 0.5rem; }
      .notify-h-2 { height: 0.5rem; }
      .notify-max-w-\\[75\\%\\] { max-width: 75%; }
      .notify-z-50 { z-index: 50; }
      .notify-z-40 { z-index: 40; }
      .notify-p-4 { padding: 1rem; }
      .notify-p-3 { padding: 0.75rem; }
      .notify-p-2 { padding: 0.5rem; }
      .notify-p-1 { padding: 0.25rem; }
      .notify-px-4 { padding-left: 1rem; padding-right: 1rem; }
      .notify-py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .notify-py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .notify-py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .notify-pl-4 { padding-left: 1rem; }
      .notify-ml-3 { margin-left: 0.75rem; }
      .notify-ml-2 { margin-left: 0.5rem; }
      .notify-mr-2 { margin-right: 0.5rem; }
      .notify-mt-1 { margin-top: 0.25rem; }
      .notify-mt-4 { margin-top: 1rem; }
      .notify-my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
      .notify-space-y-4 > * + * { margin-top: 1rem; }
      .notify-space-y-2 > * + * { margin-top: 0.5rem; }
      .notify-gap-2 { gap: 0.5rem; }
      .notify-text-sm { font-size: 0.875rem; }
      .notify-text-xs { font-size: 0.75rem; }
      .notify-text-xl { font-size: 1.25rem; }
      .notify-font-bold { font-weight: 700; }
      .notify-font-medium { font-weight: 500; }
      .notify-text-left { text-align: left; }
      .notify-text-right { text-align: right; }
      .notify-text-center { text-align: center; }
      .notify-inline-block { display: inline-block; }
      .notify-overflow-hidden { overflow: hidden; }
      .notify-overflow-auto { overflow: auto; }
      .notify-relative { position: relative; }
      .notify-border { border-width: 1px; }
      .notify-border-2 { border-width: 2px; }
      .notify-border-t { border-top-width: 1px; }
      .notify-border-white { border-color: #FFFFFF; }
      .notify-border-green-100 { border-color: #D1FAE5; }
      .notify-border-gray-100 { border-color: #F3F4F6; }
      .notify-border-gray-200 { border-color: #E5E7EB; }
      .notify-flex-1 { flex: 1 1 0%; }
      .notify-transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .notify-transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .notify-transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .notify-duration-300 { transition-duration: 300ms; }
      .notify-hover\\:bg-green-700:hover { background-color: #047857; }
      .notify-hover\\:bg-white\\/40:hover { background-color: rgba(255, 255, 255, 0.4); }
      .notify-hover\\:bg-gray-50:hover { background-color: #F9FAFB; }
      .notify-hover\\:text-gray-700:hover { color: #374151; }
      .notify-hover\\:scale-105:hover { transform: scale(1.05); }
      .notify-hover\\:underline:hover { text-decoration: underline; }
      .notify-pointer-events-none { pointer-events: none; }
      .notify-bg-transparent { background-color: transparent; }
      .notify-border-none { border-style: none; }
      .notify-focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
      .notify-bg-white\\/20 { background-color: rgba(255, 255, 255, 0.2); }
      .notify-order-1 { order: 1; }
      .notify-order-2 { order: 2; }
      .notify-opacity-100 { opacity: 1; }
      .notify-opacity-0 { opacity: 0; }
      /* Animations */
      .notify-animate-bounce {
        animation: notify-bounce 1s infinite;
      }
      @keyframes notify-bounce {
        0%, 100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
      /* Bubble button fade-out and z-index */
      .notify-bubble-hide {
        opacity: 0;
        transform: scale(0.8);
        transition: opacity 0.3s, transform 0.3s;
        pointer-events: none;
        z-index: 0;
      }
      .notify-bubble-show {
        opacity: 1;
        transform: scale(1);
        transition: opacity 0.3s, transform 0.3s;
        z-index: 50;
      }
      /* Responsive chat window */
      .notify-chat-window {
        transition: width 0.3s, height 0.3s, opacity 0.3s;
      }
      @media (max-width: 640px) {
        .notify-chat-window {
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          bottom: 0 !important;
          right: 0 !important;
        }
      }
      @media (min-width: 641px) {
        .notify-chat-window {
          width: 400px !important;
          height: 80vh !important;
          max-width: 400px !important;
          max-height: 85vh !important;
          border-radius: 0.5rem !important;
        }
      }
    `;
    shadowRoot.appendChild(style);
  }

  // Initialize the app
  async function initApp() {
    const { React, ReactDOM } = await loadDependencies();
    const { useState, useEffect, useRef, forwardRef } = React;

    function cn(...classes) {
      return classes.filter(Boolean).join(' ');
    }

    // ...Icons, Avatar, AvatarImage, AvatarFallback, ScrollArea (same as before)...

    // Main ChatBubble Component
    const ChatBubble = () => {
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
              chatWindowRef.current.style.height = isChatOpen ? `${windowHeight}px` : '0px';
            } else {
              chatWindowRef.current.style.height = isChatOpen ? '80vh' : '0px';
              chatWindowRef.current.style.maxHeight = '85vh';
            }
          }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
      }, [isChatOpen]);

      // ...sendMessage, handleQuickOption, handleKeyPress, formatTime (same as before)...

      return React.createElement(React.Fragment, null, [
        React.createElement('button', {
          className: `notify-fixed notify-bottom-6 notify-right-6 notify-bg-green-600 notify-text-white notify-rounded-full notify-w-16 notify-h-16 notify-flex notify-items-center notify-justify-center notify-shadow-lg notify-hover:bg-green-700 notify-transition-transform notify-hover:scale-105 ${isChatOpen ? 'notify-bubble-hide' : 'notify-bubble-show'}`,
          onClick: toggleChat,
          'aria-label': "Open chat",
          key: "bubble-button"
        }, React.createElement(MessageCircle, { className: "notify-w-7 notify-h-7" })),

        React.createElement('div', {
          ref: chatWindowRef,
          className: `notify-chat-window notify-fixed notify-bottom-0 notify-right-0 notify-bg-white notify-rounded-t-lg notify-shadow-xl notify-flex notify-flex-col notify-z-40 notify-transition-all notify-duration-300 ${
            isChatOpen ? 'notify-opacity-100' : 'notify-opacity-0 notify-h-0 notify-pointer-events-none'
          }`,
          style: { maxHeight: '85vh' },
          key: "chat-window"
        }, [
          // ...rest of chat window (same as before)...
        ])
      ]);
    };

    // ...Shadow DOM and render logic (same as before)...
    const shadowHost = document.createElement('div');
    shadowHost.id = 'notify-chat-bubble-host';
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
    document.body.appendChild(shadowHost);

    const chatContainer = document.createElement('div');
    chatContainer.id = 'notify-chat-bubble-container';
    shadowRoot.appendChild(chatContainer);

    addStyles(shadowRoot);
    const root = ReactDOM.createRoot(chatContainer);
    root.render(React.createElement(ChatBubble));
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp().catch(console.error);
  } else {
    document.addEventListener('DOMContentLoaded', () => initApp().catch(console.error));
  }
})();
