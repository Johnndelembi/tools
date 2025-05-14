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
    bubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <!-- Background -->
  <rect width="800" height="600" fill="#f3f4f6" />
  
  <!-- Website mockup -->
  <rect x="50" y="50" width="700" height="500" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
  <rect x="50" y="50" width="700" height="40" rx="8" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" />
  <circle cx="80" cy="70" r="6" fill="#ef4444" />
  <circle cx="105" cy="70" r="6" fill="#f59e0b" />
  <circle cx="130" cy="70" r="6" fill="#10b981" />
  
  <!-- Website content placeholder -->
  <rect x="100" y="120" width="600" height="30" rx="4" fill="#e5e7eb" />
  <rect x="100" y="170" width="500" height="20" rx="4" fill="#e5e7eb" />
  <rect x="100" y="200" width="550" height="20" rx="4" fill="#e5e7eb" />
  <rect x="100" y="230" width="480" height="20" rx="4" fill="#e5e7eb" />
  <rect x="100" y="280" width="600" height="100" rx="4" fill="#e5e7eb" />
  <rect x="100" y="400" width="300" height="30" rx="4" fill="#e5e7eb" />
  
  <!-- Chat bubble -->
  <circle cx="700" cy="500" r="32" fill="#1E3A8A" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
  <path d="M690 500h.01M700 500h.01M710 500h.01M691 508H680a5 5 0 01-5-5v-16a5 5 0 015-5h40a5 5 0 015 5v16a5 5 0 01-5 5h-13l-12 12v-12z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  
  <!-- Chat window -->
  <g>
    <rect x="460" y="220" width="320" height="280" rx="16" fill="#ffffff" filter="drop-shadow(0 10px 25px rgba(0,0,0,0.15))" />
    
    <!-- Header -->
    <rect x="460" y="220" width="320" height="60" rx="16" fill="#ffffff" />
    <!-- Avatar -->
    <circle cx="490" cy="250" r="15" fill="#3B82F6" />
    <text x="490" y="255" font-family="Inter, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle" font-weight="500">N</text>
    <!-- Name and status -->
    <text x="515" y="247" font-family="Inter, sans-serif" font-size="14" fill="#1F2937" font-weight="500">Notify Support</text>
    <text x="515" y="262" font-family="Inter, sans-serif" font-size="11" fill="#10B981">● Online</text>
    <!-- Close button -->
    <circle cx="760" cy="250" r="12" fill="#F3F4F6" />
    <path d="M756 246l8 8 M764 246l-8 8" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" />
    
    <!-- Messages area -->
    <rect x="460" y="280" width="320" height="150" fill="#F9FAFB" />
    
    <!-- Bot message -->
    <g>
      <rect x="475" y="295" width="200" height="36" rx="16" fill="#ffffff" stroke="#E5E7EB" stroke-width="1" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))" />
      <text x="490" y="317" font-family="Inter, sans-serif" font-size="12" fill="#1F2937">Hi there! How can I help you?</text>
    </g>
    
    <!-- User message -->
    <g>
      <rect x="580" y="345" width="185" height="36" rx="16" fill="#3B82F6" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))" />
      <text x="672" y="367" font-family="Inter, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">I have a question about...</text>
    </g>
    
    <!-- Modern Input area -->
    <rect x="460" y="430" width="320" height="50" fill="#ffffff" />
    <rect x="470" y="435" width="300" height="40" rx="20" fill="#F3F4F6" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05) inset)" />
    
    <!-- Input icons -->
    <circle cx="490" cy="455" r="12" fill="transparent" />
    <path d="M486 455v-4h2v4h4v2h-4v4h-2v-4h-4v-2h4z" fill="#9CA3AF" />
    
    <circle cx="515" cy="455" r="12" fill="transparent" />
    <circle cx="515" cy="455" r="8" stroke="#9CA3AF" stroke-width="1.5" fill="none" />
    <circle cx="512" cy="452" r="1.5" fill="#9CA3AF" />
    <circle cx="518" cy="452" r="1.5" fill="#9CA3AF" />
    <path d="M511 458q4 3 8 0" stroke="#9CA3AF" stroke-width="1.5" fill="none" stroke-linecap="round" />
    
    <!-- Input text area -->
    <text x="540" y="459" font-family="Inter, sans-serif" font-size="12" fill="#9CA3AF">Type a message...</text>
    
    <!-- Send button -->
    <circle cx="750" cy="455" r="16" fill="#3B82F6" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))" />
    <path d="M750 450 L750 460 M745 455 L755 455 M753 452 L758 455 L753 458" stroke="#ffffff" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Footer -->
    <rect x="460" y="480" width="320" height="20" fill="#F9FAFB" />
    <text x="620" y="494" font-family="Inter, sans-serif" font-size="10" fill="#6B7280" text-anchor="middle">Powered By </text>
    <text x="670" y="494" font-family="Inter, sans-serif" font-size="10" fill="#3B82F6" text-anchor="middle" font-weight="500">Notify Africa</text>
  </g>
</svg>'; 
    document.body.appendChild(bubble);

    // Create chat window
    const window = document.createElement('div');
    window.id = 'chat-window';
    window.style.display = 'none';
    window.innerHTML = `
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-width:120px;margin:16px auto;display:block"/>` : ''}
        <div id="chat-messages"></div>
        <div id="chat-input">
            <input type="text" id="message-input" placeholder="Type a message...">
            <button id="send-button">Send</button>
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
                console.log('Sending message:', { userId, sessionId, message: msg });
                const res = await fetch('http://127.0.0.1:8000/v1/message', {
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
                console.log('Response status:', res.status);
                const data = await res.json();
                console.log('Response data:', data);
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
                console.error('Fetch error:', e);
                this.displayMessage('Error: Failed to send message', 'bot');
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

    // Attach events
    bubble.addEventListener('click', window.chatBubble.toggleChat);
    document.getElementById('send-button').addEventListener('click', () => window.chatBubble.sendMessage());
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.chatBubble.sendMessage();
        }
    });
})();
