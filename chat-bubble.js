(function () {
    // Extract data attributes from script tag
    const scriptTag = document.currentScript;
    const userId = scriptTag.getAttribute('data-user-id') || 'notify';
    const sessionId = scriptTag.getAttribute('data-session-id') || 'notify';
    const bgColor = scriptTag.getAttribute('data-bg-color') || '#fff';
    const textColor = scriptTag.getAttribute('data-text-color') || '#000';
    const logoUrl = scriptTag.getAttribute('data-logo-url') || '';

    // Load Inter font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Create chat bubble
    const bubble = document.createElement('div');
    bubble.id = 'chat-bubble';
    bubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>';
    document.body.appendChild(bubble);

    // Create chat window
    const window = document.createElement('div');
    window.id = 'chat-window';
    window.style.display = 'none';
    window.innerHTML = `
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-width:120px;margin:16px auto;display:block"/>` : ''}
        <div id="chat-messages"></div>
        <div id="chat-input">
            <input type="text" id="message-input" placeholder="Type a message..." onkeypress="if(event.key==='Enter')window.chatBubble.sendMessage()">
            <button onclick="window.chatBubble.sendMessage()">Send</button>
        </div>
        <div id="chat-footer">
            <a href="https://notify.africa/" target="_blank" rel="noopener noreferrer">Powered By Notify Africa</a>
        </div>
    `;
    document.body.appendChild(window);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #chat-bubble {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #1E3A8A;
            color: #FFFFFF;
            border-radius: 50%;
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        #chat-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        #chat-window {
            position: fixed;
            bottom: 100px;
            right: 24px;
            width: 320px;
            height: 480px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            display: none;
            flex-direction: column;
            background: ${bgColor};
            color: ${textColor};
            font-family: 'Inter', sans-serif;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: #F9FAFB;
            border-radius: 12px 12px 0 0;
        }
        #chat-input {
            display: flex;
            gap: 8px;
            padding: 12px;
            border-top: 1px solid #E5E7EB;
            background: ${bgColor};
        }
        #chat-input input {
            flex: 1;
            padding: 10px;
            border: 1px solid #D1D5DB;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: ${textColor};
        }
        #chat-input input:focus {
            outline: none;
            border-color: #3B82F6;
            box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        #chat-input button {
            padding: 10px 16px;
            background: #3B82F6;
            color: #FFFFFF;
            border: none;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        #chat-input button:hover {
            background: #2563EB;
        }
        #chat-footer {
            text-align: center;
            padding: 8px;
            font-size: 12px;
            color: #6B7280;
            border-top: 1px solid #E5E7EB;
        }
        #chat-footer a {
            color: #3B82F6;
            text-decoration: none;
            font-weight: 500;
        }
        #chat-footer a:hover {
            text-decoration: underline;
        }
        .message-user {
            text-align: right;
            margin: 8px 0;
        }
        .message-bot {
            text-align: left;
            margin: 8px 0;
        }
        .message-user p {
            display: inline-block;
            padding: 10px 14px;
            background: #DBEAFE;
            border-radius: 12px 12px 0 12px;
            font-size: 14px;
            max-width: 80%;
            line-height: 1.5;
        }
        .message-bot p {
            display: inline-block;
            padding: 10px 14px;
            background: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 12px 12px 12px 0;
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
            try {
                const res = await fetch('http://localhost:8000/v1/message', {
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
                        if (Array.isArray(data.detail)) {
                            errorMsg = 'Error: ' + data.detail.map(e => e.msg).join(', ');
                        } else {
                            errorMsg = 'Error: ' + data.detail;
                        }
                    }
                    this.displayMessage(errorMsg, 'bot');
                }
            } catch (e) {
                this.displayMessage('Error: ' + e.message, 'bot');
            }
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

    // Attach toggle event
    document.getElementById('chat-bubble').addEventListener('click', window.chatBubble.toggleChat);
})();
