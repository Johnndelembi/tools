(function () {
    // Extract data attributes from script tag
    const scriptTag = document.currentScript;
    const userId = scriptTag.getAttribute('data-user-id') || 'root';
    const sessionId = scriptTag.getAttribute('data-session-id') || 'root';
    const bgColor = scriptTag.getAttribute('data-bg-color') || '#fff';
    const textColor = scriptTag.getAttribute('data-text-color') || '#000';
    const logoUrl = scriptTag.getAttribute('data-logo-url') || '';

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
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-width:100px;margin:10px"/>` : ''}
        <div id="chat-messages"></div>
        <div id="chat-input">
            <input type="text" id="message-input" placeholder="Type a message..." onkeypress="if(event.key==='Enter')window.chatBubble.sendMessage()">
        </div>
    `;
    document.body.appendChild(window);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #chat-bubble {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #3b82f6;
            color: #fff;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        #chat-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 300px;
            height: 400px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            flex-direction: column;
            background: ${bgColor};
            color: ${textColor};
        }
        #chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }
        #chat-input {
            border-top: 1px solid #e5e7eb;
            padding: 10px;
        }
        #chat-input input {
            width: 100%;
            padding: 8px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
        }
        .message-user {
            text-align: right;
            margin-bottom: 8px;
        }
        .message-bot {
            text-align: left;
            margin-bottom: 8px;
        }
        .message-user p {
            display: inline-block;
            padding: 8px;
            background: #dbeafe;
            border-radius: 8px;
        }
        .message-bot p {
            display: inline-block;
            padding: 8px;
            background: #f3f4f6;
            border-radius: 8px;
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