class ChatBotWidget {
  constructor(options) {
    this.apiUrl = options.apiUrl || 'http://localhost:8000/webhook/message';
    this.position = options.position || 'bottom-right';
    this.wa_id = options.wa_id || 'default_wa_id';
    this.name = options.name || 'User';
    this.container = document.getElementById('chatbot-widget');
    this.isOpen = false;

    if (!this.container) {
      console.error('ChatBotWidget: Container #chatbot-widget not found.');
      return;
    }

    this.init();
  }

  init() {
    this.createWidget();
    this.attachEventListeners();
    this.setPosition();
  }

  createWidget() {
    // Create widget elements
    this.container.innerHTML = `
      <div class="chatbot-container">
        <div class="chatbot-header">
          <span>Chat with ${this.name}</span>
          <button class="chatbot-toggle-btn">×</button>
        </div>
        <div class="chatbot-messages"></div>
        <div class="chatbot-input">
          <input type="text" placeholder="Type a message..." />
          <button>Send</button>
        </div>
      </div>
      <button class="chatbot-open-btn">💬</button>
    `;

    // Apply styles
    const styles = `
      <style>
        .chatbot-container {
          display: none;
          position: fixed;
          width: 300px;
          height: 400px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          flex-direction: column;
          z-index: 1000;
        }
        .chatbot-header {
          background: #007bff;
          color: #fff;
          padding: 10px;
          border-radius: 10px 10px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chatbot-toggle-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }
        .chatbot-messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .chatbot-message {
          max-width: 70%;
          padding: 8px 12px;
          border-radius: 10px;
        }
        .chatbot-message.user {
          background: #007bff;
          color: #fff;
          align-self: flex-end;
        }
        .chatbot-message.bot {
          background: #f1f1f1;
          color: #333;
          align-self: flex-start;
        }
        .chatbot-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ddd;
        }
        .chatbot-input input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin-right: 5px;
        }
        .chatbot-input button {
          padding: 8px 12px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .chatbot-open-btn {
          position: fixed;
          width: 50px;
          height: 50px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 1000;
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);

    this.messagesContainer = this.container.querySelector('.chatbot-messages');
    this.input = this.container.querySelector('.chatbot-input input');
    this.sendButton = this.container.querySelector('.chatbot-input button');
    this.toggleButton = this.container.querySelector('.chatbot-toggle-btn');
    this.openButton = this.container.querySelector('.chatbot-open-btn');
    this.chatContainer = this.container.querySelector('.chatbot-container');
  }

  setPosition() {
    const [vertical, horizontal] = this.position.split('-');
    const offset = '20px';
    this.chatContainer.style[vertical] = offset;
    this.chatContainer.style[horizontal] = offset;
    this.openButton.style[vertical] = offset;
    this.openButton.style[horizontal] = offset;
  }

  attachEventListeners() {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    this.toggleButton.addEventListener('click', () => this.toggleChat());
    this.openButton.addEventListener('click', () => this.toggleChat());
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatContainer.style.display = this.isOpen ? 'flex' : 'none';
    this.openButton.style.display = this.isOpen ? 'none' : 'block';
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    // Display user message
    this.addMessage(message, 'user');
    this.input.value = '';

    // Send message to API
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wa_id: this.wa_id,
          name: this.name,
          message_body: message
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      // Extract response field from API
      this.addMessage(data.response || 'No response received', 'bot');
    } catch (error) {
      console.error('ChatBotWidget: Error sending message:', error);
      this.addMessage('Sorry, something went wrong.', 'bot');
    }
  }

  addMessage(text, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-message ${type}`;
    messageElement.textContent = text;
    this.messagesContainer.appendChild(messageElement);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

window.ChatBotWidget = ChatBotWidget;
