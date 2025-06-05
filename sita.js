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
    // Check for existing compatible React/ReactDOM
    if (window.React && window.ReactDOM && window.React.version.startsWith('18')) {
      return { React: window.React, ReactDOM: window.ReactDOM };
    }

    // Load React and ReactDOM asynchronously
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
    await loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
    return { React: window.React, ReactDOM: window.ReactDOM };
  }

  // Add scoped styles to Shadow DOM
  function addStyles(shadowRoot) {
    const style = document.createElement('style');
    style.textContent = `
      /* Scoped styles with notify- prefix */
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
      
      /* Rich Text Styles */
      .notify-rich-text h1 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
      .notify-rich-text h2 { font-size: 1.3em; font-weight: bold; margin: 0.5em 0; }
      .notify-rich-text h3 { font-size: 1.1em; font-weight: bold; margin: 0.5em 0; }
      .notify-rich-text p { margin: 0.5em 0; }
      .notify-rich-text ul { list-style-type: disc; margin: 0.5em 0; padding-left: 1.5em; }
      .notify-rich-text ol { list-style-type: decimal; margin: 0.5em 0; padding-left: 1.5em; }
      .notify-rich-text li { margin: 0.25em 0; }
      .notify-rich-text a { color: #059669; text-decoration: underline; }
      .notify-rich-text code { background-color: #F3F4F6; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: monospace; }
      .notify-rich-text pre { background-color: #F3F4F6; padding: 1em; border-radius: 0.5em; overflow-x: auto; margin: 0.5em 0; }
      .notify-rich-text pre code { background-color: transparent; padding: 0; }
      .notify-rich-text blockquote { border-left: 4px solid #D1FAE5; padding-left: 1em; margin: 0.5em 0; color: #374151; }
      .notify-rich-text table { border-collapse: collapse; width: 100%; margin: 0.5em 0; }
      .notify-rich-text th, .notify-rich-text td { border: 1px solid #E5E7EB; padding: 0.5em; }
      .notify-rich-text img { max-width: 100%; height: auto; margin: 0.5em 0; }
      .notify-rich-text hr { border: none; border-top: 1px solid #E5E7EB; margin: 1em 0; }
      .notify-rich-text strong { font-weight: bold; }
      .notify-rich-text em { font-style: italic; }
      
      /* Dark message variant */
      .notify-rich-text-dark h1,
      .notify-rich-text-dark h2,
      .notify-rich-text-dark h3,
      .notify-rich-text-dark p,
      .notify-rich-text-dark li { color: #FFFFFF; }
      .notify-rich-text-dark a { color: #D1FAE5; }
      .notify-rich-text-dark code { background-color: rgba(255, 255, 255, 0.1); }
      .notify-rich-text-dark pre { background-color: rgba(255, 255, 255, 0.1); }
      .notify-rich-text-dark blockquote { border-left-color: #D1FAE5; color: #D1FAE5; }
      .notify-rich-text-dark th, .notify-rich-text-dark td { border-color: rgba(255, 255, 255, 0.2); }
      
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
      
      /* Media queries */
      /* Mobile - Small */
      @media (max-width: 380px) {
        .notify-xs\\:w-full { width: 100%; }
        .notify-xs\\:bottom-0 { bottom: 0; }
        .notify-xs\\:right-0 { right: 0; }
        .notify-xs\\:h-\\[90vh\\] { height: 90vh; }
      }

      /* Mobile - Default */
      @media (min-width: 381px) and (max-width: 639px) {
        .notify-sm\\:w-full { width: 100%; }
        .notify-sm\\:bottom-0 { bottom: 0; }
        .notify-sm\\:right-0 { right: 0; }
        .notify-sm\\:h-\\[85vh\\] { height: 85vh; }
      }

      /* Tablet */
      @media (min-width: 640px) and (max-width: 1023px) {
        .notify-md\\:bottom-16 { bottom: 4rem; }
        .notify-md\\:right-6 { right: 1.5rem; }
        .notify-md\\:w-\\[450px\\] { width: 450px; }
        .notify-md\\:rounded-lg { border-radius: 0.5rem; }
        .notify-md\\:h-\\[75vh\\] { height: 75vh; }
        .notify-md\\:h-0 { height: 0; }
      }

      /* Desktop */
      @media (min-width: 1024px) {
        .notify-lg\\:bottom-24 { bottom: 6rem; }
        .notify-lg\\:right-8 { right: 2rem; }
        .notify-lg\\:w-\\[500px\\] { width: 500px; }
        .notify-lg\\:rounded-lg { border-radius: 0.5rem; }
        .notify-lg\\:h-\\[70vh\\] { height: 70vh; }
        .notify-lg\\:h-0 { height: 0; }
      }
    `;
    shadowRoot.appendChild(style);
  }

  // Initialize the app
  async function initApp() {
    const { React, ReactDOM } = await loadDependencies();
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
        className: `notify-relative notify-flex notify-h-10 notify-w-10 notify-shrink-0 notify-overflow-hidden notify-rounded-full ${className || ''}`,
        ...props
      }, children)
    );

    const AvatarImage = ({ src, alt = "", className, ...props }) => (
      React.createElement('img', {
        className: `notify-aspect-square notify-h-full notify-w-full ${className || ''}`,
        src,
        alt,
        ...props
      })
    );

    const AvatarFallback = ({ className, children, ...props }) => (
      React.createElement('div', {
        className: `notify-flex notify-h-full notify-w-full notify-items-center notify-justify-center notify-rounded-full ${className || ''}`,
        ...props
      }, children)
    );

    // ScrollArea Component
    const ScrollArea = forwardRef(({ className, children, ...props }, ref) => (
      React.createElement('div', {
        ref,
        className: cn("notify-relative notify-overflow-hidden", className),
        ...props
      }, 
        React.createElement('div', { 
          className: "notify-h-full notify-w-full notify-overflow-auto" 
        }, children)
      )
    ));
    ScrollArea.displayName = 'ScrollArea';

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
            const windowWidth = window.innerWidth;
            
            // Responsive height adjustments
            let chatHeight;
            if (windowWidth <= 380) {
              chatHeight = isChatOpen ? `${windowHeight * 0.9}px` : '0px'; // Small mobile
            } else if (windowWidth <= 639) {
              chatHeight = isChatOpen ? `${windowHeight * 0.85}px` : '0px'; // Regular mobile
            } else if (windowWidth <= 1023) {
              chatHeight = isChatOpen ? '75vh' : '0px'; // Tablet
            } else {
              chatHeight = isChatOpen ? '70vh' : '0px'; // Desktop
            }
            
            chatWindowRef.current.style.height = chatHeight;
            
            // Set max height based on screen size
            const maxHeight = windowWidth <= 639 ? '95vh' : '85vh';
            chatWindowRef.current.style.maxHeight = maxHeight;
          }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
      }, [isChatOpen]);

      const sendMessage = async (text) => {
        const messageToSend = text || message;
        if (!messageToSend.trim()) return;
        
        setShowQuickOptions(false);
        setMessages(prev => [...prev, { text: messageToSend, sender: 'user' }]);
        setMessage('');
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

      // Function to safely render markdown
      const renderMarkdown = (text) => {
        try {
          const sanitizedText = text
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          return { __html: marked.parse(sanitizedText, { breaks: true }) };
        } catch (e) {
          console.error('Markdown parsing error:', e);
          return { __html: text };
        }
      };

      return React.createElement(React.Fragment, null, [
        React.createElement('button', {
          className: "notify-fixed notify-bottom-6 notify-right-6 notify-bg-green-600 notify-text-white notify-rounded-full notify-w-16 notify-h-16 notify-flex notify-items-center notify-justify-center notify-shadow-lg notify-hover:bg-green-700 notify-transition-transform notify-hover:scale-105 notify-z-50",
          onClick: toggleChat,
          'aria-label': "Open chat",
          key: "bubble-button"
        }, React.createElement(MessageCircle, { className: "notify-w-7 notify-h-7" })),

        React.createElement('div', {
          ref: chatWindowRef,
          className: `notify-fixed 
            notify-xs:bottom-0 notify-xs:right-0 notify-xs:w-full
            notify-sm:bottom-0 notify-sm:right-0 notify-sm:w-full
            notify-md:bottom-16 notify-md:right-6 notify-md:w-[450px]
            notify-lg:bottom-24 notify-lg:right-8 notify-lg:w-[500px]
            notify-bg-white notify-rounded-t-lg notify-md:rounded-lg notify-lg:rounded-lg
            notify-shadow-xl notify-flex notify-flex-col notify-z-40 
            notify-transition-all notify-duration-300
            ${isChatOpen ? 'notify-opacity-100' : 'notify-opacity-0 notify-pointer-events-none'}`,
          style: { maxHeight: '85vh' },
          key: "chat-window"
        }, [
          React.createElement('div', { 
            className: "notify-bg-green-200 notify-p-4 notify-rounded-t-lg",
            key: "chat-header"
          }, 
            React.createElement('div', { className: "notify-flex notify-items-center notify-justify-between" }, [
              React.createElement('div', { className: "notify-flex notify-items-center", key: "avatar-container" }, [
                React.createElement(Avatar, { className: "notify-h-12 notify-w-12 notify-border-2 notify-border-white", key: "avatar" }, [
                  React.createElement(AvatarImage, { src: logoUrl || "", alt: "Support", key: "avatar-img" }),
                  React.createElement(AvatarFallback, { className: "notify-bg-green-600 notify-text-white", key: "avatar-fallback" }, "E")
                ]),
                React.createElement('div', { className: "notify-ml-3", key: "header-text" }, [
                  React.createElement('div', { className: "notify-text-sm notify-text-green-800", key: "support-text" }, "Chat with Support Team"),
                  React.createElement('div', { className: "notify-text-xl notify-font-bold notify-text-green-900 notify-flex notify-items-center", key: "online-status" }, [
                    "Elina is Online ",
                    React.createElement('span', { className: "notify-w-2 notify-h-2 notify-bg-green-500 notify-rounded-full notify-inline-block notify-ml-2", key: "status-dot" })
                  ])
                ])
              ]),
              React.createElement('button', {
                onClick: toggleChat,
                className: "notify-w-8 notify-h-8 notify-rounded-full notify-bg-white/20 notify-hover:bg-white/40 notify-flex notify-items-center notify-justify-center notify-transition-colors",
                'aria-label': "Close chat",
                key: "close-button"
              }, React.createElement(X, { className: "notify-w-5 notify-h-5 notify-text-green-900" }))
            ])
          ),

          React.createElement(ScrollArea, { 
            className: "notify-flex-1 notify-p-4 notify-bg-white",
            key: "messages-container"
          }, 
            React.createElement('div', { className: "notify-space-y-4" }, [
              ...messages.map((msg, index) => 
                React.createElement('div', { key: index }, 
                  msg.sender === 'system' 
                    ? React.createElement('div', { className: "notify-flex notify-justify-center notify-my-6" }, 
                        React.createElement('div', { className: "notify-text-xs notify-text-green-600 notify-bg-green-50 notify-px-4 notify-py-1 notify-rounded-full notify-border notify-border-green-100 notify-flex notify-items-center" }, [
                          React.createElement('span', { className: "notify-mr-2", key: "check" }, "✓"),
                          msg.text
                        ])
                      )
                    : React.createElement('div', { className: `notify-flex ${msg.sender === 'user' ? 'notify-justify-end' : 'notify-justify-start'} notify-items-end notify-gap-2` }, [
                        msg.sender === 'bot' && React.createElement(Avatar, { className: "notify-h-8 notify-w-8", key: "bot-avatar" }, 
                          React.createElement(AvatarFallback, { className: "notify-bg-green-600 notify-text-white notify-text-xs" }, "E")
                        ),
                        React.createElement('div', { 
                          className: `notify-max-w-[75%] ${msg.sender === 'user' ? 'notify-order-1' : 'notify-order-2'}`,
                          key: "message-bubble"
                        }, [
                          React.createElement('div', { 
                            className: `notify-rounded-2xl notify-p-4 ${
                              msg.sender === 'user' 
                                ? 'notify-bg-green-600 notify-text-white notify-rounded-br-none notify-rich-text notify-rich-text-dark' 
                                : 'notify-bg-gray-100 notify-text-gray-800 notify-rounded-bl-none notify-rich-text'
                            }`,
                            dangerouslySetInnerHTML: renderMarkdown(msg.text),
                            key: "message-text"
                          }),
                          React.createElement('div', { 
                            className: `notify-text-xs notify-text-gray-500 notify-mt-1 ${msg.sender === 'user' ? 'notify-text-right' : 'notify-text-left'}`,
                            key: "message-time"
                          }, `${msg.sender === 'bot' ? 'Elina • ' : ''}${formatTime()}`)
                        ]),
                        msg.sender === 'user' && React.createElement(Avatar, { className: "notify-h-8 notify-w-8 notify-order-2", key: "user-avatar" }, 
                          React.createElement(AvatarFallback, { className: "notify-bg-gray-400 notify-text-white notify-text-xs" }, "U")
                        )
                      ])
                )
              ),
              
              showQuickOptions && React.createElement('div', { className: "notify-space-y-2 notify-mt-4", key: "quick-options" }, [
                React.createElement('button', {
                  onClick: () => handleQuickOption("Chat with Support"),
                  className: "notify-w-full notify-text-left notify-py-3 notify-px-4 notify-border notify-border-gray-200 notify-rounded-lg notify-hover:bg-gray-50 notify-transition-colors",
                  key: "option-1"
                }, "Chat with Support"),
                React.createElement('button', {
                  onClick: () => handleQuickOption("What hours are you available?"),
                  className: "notify-w-full notify-text-left notify-py-3 notify-px-4 notify-border notify-border-gray-200 notify-rounded-lg notify-hover:bg-gray-50 notify-transition-colors",
                  key: "option-2"
                }, "What hours are you available?"),
                React.createElement('button', {
                  onClick: () => handleQuickOption("Where can I find pricing information?"),
                  className: "notify-w-full notify-text-left notify-py-3 notify-px-4 notify-border notify-border-gray-200 notify-rounded-lg notify-hover:bg-gray-50 notify-transition-colors",
                  key: "option-3"
                }, "Where can I find pricing information?")
              ]),
              
              isLoading && React.createElement('div', { className: "notify-flex notify-items-end notify-gap-2", key: "loading-indicator" }, [
                React.createElement(Avatar, { className: "notify-h-8 notify-w-8" }, 
                  React.createElement(AvatarFallback, { className: "notify-bg-green-600 notify-text-white notify-text-xs" }, "E")
                ),
                React.createElement('div', { className: "notify-bg-gray-100 notify-px-4 notify-py-3 notify-rounded-2xl notify-rounded-bl-none" }, 
                  React.createElement('div', { className: "notify-flex notify-gap-2" }, [
                    React.createElement('div', { className: "notify-w-2 notify-h-2 notify-bg-gray-400 notify-rounded-full notify-animate-bounce", key: "dot-1" }),
                    React.createElement('div', { 
                      className: "notify-w-2 notify-h-2 notify-bg-gray-400 notify-rounded-full notify-animate-bounce", 
                      style: { animationDelay: '0.2s' },
                      key: "dot-2"
                    }),
                    React.createElement('div', { 
                      className: "notify-w-2 notify-h-2 notify-bg-gray-400 notify-rounded-full notify-animate-bounce", 
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
            className: "notify-p-4 notify-border-t notify-border-gray-100",
            key: "chat-input"
          }, 
            React.createElement('div', { className: "notify-bg-gray-100 notify-rounded-full notify-p-1 notify-pl-4 notify-flex notify-items-center" }, [
              React.createElement('input', {
                type: "text",
                placeholder: "Write a message...",
                className: "notify-flex-1 notify-bg-transparent notify-border-none notify-text-gray-800 notify-focus:outline-none notify-text-sm",
                value: message,
                onChange: (e) => setMessage(e.target.value),
                onKeyPress: handleKeyPress,
                key: "message-input"
              }),
              React.createElement('div', { className: "notify-flex notify-items-center", key: "input-buttons" }, [
                React.createElement('button', { 
                  className: "notify-p-2 notify-text-gray-500 notify-hover:text-gray-700 notify-rounded-full",
                  key: "smile-button"
                }, 
                  React.createElement(SmileIcon, { className: "notify-w-5 notify-h-5" })
                ),
                React.createElement('button', {
                  className: "notify-bg-gray-900 notify-text-white notify-p-3 notify-rounded-full notify-flex notify-items-center notify-justify-center",
                  onClick: () => sendMessage(),
                  disabled: !message.trim(),
                  key: "send-button"
                }, 
                  React.createElement(Send, { className: "notify-w-5 notify-h-5" })
                )
              ])
            ])
          ),

          React.createElement('div', { 
            className: "notify-px-4 notify-py-2 notify-text-xs notify-text-center notify-text-gray-500 notify-border-t notify-border-gray-100",
            key: "chat-footer"
          }, [
            "Powered By ",
            React.createElement('a', {
              href: "https://notify.africa/",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "notify-text-green-600 notify-font-medium notify-hover:underline",
              key: "footer-link"
            }, "Notify Africa")
          ])
        ])
      ]);
    };

    // Create Shadow DOM and render
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

  // Initialize after DOM is loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp().catch(console.error);
  } else {
    document.addEventListener('DOMContentLoaded', () => initApp().catch(console.error));
  }
})();
