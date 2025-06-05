import Chatbot from 'flowise-embed';

(function() {
  'use strict';

  // Get script parameters from data attributes
  const scriptTag = document.currentScript;
  const userId = scriptTag.getAttribute('data-user-id') || 'notify';
  const sessionId = scriptTag.getAttribute('data-session-id') || 'notify';
  const bgColor = scriptTag.getAttribute('data-bg-color') || '#52DD69';
  const textColor = scriptTag.getAttribute('data-text-color') || '#FFFFFF';
  const logoUrl = scriptTag.getAttribute('data-logo-url') || '';
  const baseUrl = scriptTag.getAttribute('data-base-url') || 'http://127.0.0.1:3000';

  // Initialize the app
  async function initApp() {
    try {
      // Create container for Flowise chat
      const chatContainer = document.createElement('div');
      chatContainer.id = 'chatbot-container';
      document.body.appendChild(chatContainer);

      // Initialize Flowise chat
      // Configure and initialize Flowise
      Chatbot.init({
        chatflowid: userId,
        apiHost: baseUrl,
        theme: {
          chatWindow: {
            backgroundColor: bgColor || '#FFFFFF',
            textColor: textColor || '#000000',
            height: 700,
            width: 400,
            fontSize: 16
          },
          button: {
            backgroundColor: bgColor || '#52DD69',
            right: 20,
            bottom: 20,
            size: "medium",
          }
        },
        sessionId: sessionId,
        chatflowConfig: {
          logo: logoUrl
        }
      });
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  }

  // Initialize after DOM is loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp().catch(console.error);
  } else {
    document.addEventListener('DOMContentLoaded', () => initApp().catch(console.error));
  }
})();
