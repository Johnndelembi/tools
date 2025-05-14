(function () {
    // Extract data attributes from script tag
    const scriptTag = document.currentScript;
    const userId = scriptTag.getAttribute('data-user-id') || 'notify';
    const sessionId = scriptTag.getAttribute('data-session-id') || 'notify';
    const bgColor = scriptTag.getAttribute('data-bg-color') || '#FFFFFF';
    const textColor = scriptTag.getAttribute('data-text-color') || '#1F2937';
    const logoUrl = scriptTag.getAttribute('data-logo-url') || '';
    const baseUrl = scriptTag.getAttribute('data-base-url') || 'http://127.0.0.1:8000';

    // Load Inter font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Create chat bubble
    const bubble = document.createElement('div');
    bubble.id = 'chat-bubble';
    bubble.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
    `;
    document.body.appendChild(bubble);

    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chat-window';
    chatWindow.style.display = 'none';
    chatWindow.innerHTML = `
        <div id="chat-header">
            <div class="avatar">N</div>
            <div class="header-info">
                <div class="title">Notify Support</div>
                <div class="status"><span class="status-dot"></span>Online</div>
            </div>
            <button id="close-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <div id="chat-messages">
            <div class="message-bot">
                <p>Hi there! How can I help you?</p>
            </div>
        </div>
        <div id="chat-input">
            <button id="emoji-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </button>
            <input type="text" id="message-input" placeholder="Type a message...">
            <button id="send-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
            </button>
        </div>
        <div id="chat-footer">
            Powered By <a href="https://notify.africa/" target="_blank" rel="noopener noreferrer" class="footer-link">Notify Africa</a>
        </div>
    `;
    document.body.appendChild(chatWindow);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #chat-bubble {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #15803d;
            color: #FFFFFF;
            border-radius: 50%;
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: transform 0.3s ease;
        }
        #chat-bubble:hover {
            transform: scale(1.1);
        }
        #chat-window {
            position: fixed;
            bottom: 96px;
            right: 24px;
            width: 320px;
            height: 384px;
            background: ${bgColor};
            color: ${textColor};
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            display: none;
            flex-direction: column;
            font-family: 'Inter', sans-serif;
            animation: fadeIn 0.3s ease;
            overflow: hidden;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #chat-header {
            padding: 16px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #E5E7EB;
            background: ${bgColor};
        }
        .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #16a34a;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
            flex-shrink: 0;
        }
        .header-info {
            margin-left: 12px;
            flex: 1;
        }
        .title {
            font-size: 14px;
            font-weight: 500;
            color: #1F2937;
        }
        .status {
            font-size: 12px;
            color: #16a34a;
            display: flex;
            align-items: center;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            background: #16a34a;
            border-radius: 50%;
            display: inline-block;
            margin-right: 4px;
        }
        #close-button {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #F3F4F6;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
        }
        #chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: #F9FAFB;
        }
        #chat-input {
            display: flex;
            align-items: center;
            padding: 12px;
            border-top: 1px solid #E5E7EB;
            background: ${bgColor};
        }
        #emoji-button {
            padding: 8px;
            border-radius: 50%;
            color: #6B7280;
            background: none;
            border: none;
            cursor: pointer;
        }
        #emoji-button:hover {
            background: #F3F4F6;
        }
        #chat-input input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #D1D5DB;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: ${textColor};
        }
        #chat-input input:focus {
            outline: none;
            border-color: #16a34a;
        }
        #send-button {
            padding: 8px;
            background: #16a34a;
            color: #FFFFFF;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        #send-button:hover {
            background: #15803d;
        }
        #chat-footer {
            text-align: center;
            padding: 8px;
            font-size: 12px;
            color: #6B7280;
            border-top: 1px solid #E5E7EB;
        }
        .footer-link {
            color: #16a34a;
            text-decoration: none;
            font-weight: 500;
        }
        .footer-link:hover {
            text-decoration: underline;
        }
        .message-user {
            text-align: right;
            margin: 12px 0;
        }
        .message-bot {
            text-align: left;
            margin: 12px 0;
        }
        .message-user p {
            display: inline-block;
            padding: 8px 12px;
            background: #16a34a;
            color: #FFFFFF;
            border-radius: 8px 8px 0 8px;
            font-size: 14px;
            max-width: 80%;
            line-height: 1.5;
        }
        .message-bot p {
            display: inline-block;
            padding: 8px 12px;
            background: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 8px 8px 8px 0;
            font-size: 14px;
            max-width: 80%;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);

    // Chat bubble functions
    window.chatBubble = {
        toggleChat: function () {
            const w = document.getElementById('chat-window');
            w.style.display = w.style.display === 'none' ? 'flex' : 'none';
        },
        sendMessage: async function () {
            const input = document.getElementById('message-input');
            const msg = input.value.trim();
            if (!msg) return;
            this.displayMessage(msg, 'user');
            input.value = '';
            // Simulate bot response (as in React version)
            setTimeout(() => {
                this.displayMessage('Thanks for your message! How else can I assist you today?', 'bot');
            }, 1000);
            // Uncomment below for actual API call
            /*
            try {
                const res = await fetch(`${baseUrl}/v1/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-ID': userId
                    },
                    body: JSON.stringify({
                        max_tokens: 100,
                        message: msg,
                        session_id: sessionId,
                        temperature: 0.6,
                        user_id: userId,
                        role: 'user'
                    })
                });
                const data = await res.json();
                if (data.message) {
                    this.displayMessage(data.message, 'bot');
                } else {
                    let errorMsg = 'Error: Unknown error';
                    if (data.detail) {
                        errorMsg = 'Error: ' + (Array.isArray(data.detail) ? data.detail.map(e => e.msg).join(', ') : data.detail);
                    }
                    this.displayMessage(errorMsg, 'bot');
                }
            } catch (e) {
                this.displayMessage('Error: Failed to send message', 'bot');
            }
            */
        },
        displayMessage: function (text, sender) {
            const messages = document.getElementById('chat-messages');
            const div = document.createElement('div');
            div.className = 'message-' + sender;
            const p = document.createElement('p');
            p.textContent = text;
            div.appendChild(p);
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }
    };

    // Attach events
    bubble.addEventListener('click', window.chatBubble.toggleChat);
    document.getElementById('close-button').addEventListener('click', window.chatBubble.toggleChat);
    document.getElementById('send-button').addEventListener('click', () => window.chatBubble.sendMessage());
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.chatBubble.sendMessage();
        }
    });
    // Emoji button placeholder (no functionality implemented)
    document.getElementById('emoji-button').addEventListener('click', () => {
        console.log('Emoji button clicked');
    });
})();
