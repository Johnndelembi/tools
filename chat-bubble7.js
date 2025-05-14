import { useState, useEffect } from 'react';

export default function NotifyChatPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! How can I help you?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (inputValue.trim() === "") return;
    
    // Add user message
    setMessages([...messages, { text: inputValue, sender: "user" }]);
    
    // Clear input
    setInputValue("");
    
    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! How else can I assist you today?", 
        sender: "bot" 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Website mockup */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Browser top bar */}
        <div className="bg-gray-50 h-10 flex items-center px-4 border-b">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Website content */}
        <div className="p-8">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-3/5 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      
      {/* Chat bubble */}
      <div 
        className="fixed bottom-6 right-6 bg-green-700 text-white rounded-full w-16 h-16 flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110"
        onClick={toggleChat}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col animate-fadeIn overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-center border-b">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium flex-shrink-0">
              N
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-800">Notify Support</div>
              <div className="text-xs text-green-500 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1"></span>
                Online
              </div>
            </div>
            <div className="ml-auto">
              <button 
                onClick={toggleChat}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div 
                  className={`inline-block px-4 py-2 rounded-lg max-w-xs text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-green-600 text-white rounded-bl-lg' 
                      : 'bg-white border border-gray-200 rounded-br-lg'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input area */}
          <div className="p-3 border-t">
            <div className="flex items-center">
              {/* Emoji Button */}
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center py-2 text-xs text-gray-500 border-t">
            Powered By <span className="text-green-600 font-medium">Notify Africa</span>
          </div>
        </div>
      )}
    </div>
  );
}
