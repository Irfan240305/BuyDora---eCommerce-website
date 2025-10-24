// src/components/ChatWidget.jsx
import React, { useState } from "react";
import useChatAI from "../hooks/useChatAI";
import "./ChatWidget.css";

const ChatWidget = () => {
  const { messages, sendMessage, loading, clearChat } = useChatAI();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    await sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        💬
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <h3>Assistant</h3>
            <div>
              <button onClick={clearChat} title="Clear chat">🗑️</button>
              <button onClick={() => setIsOpen(false)} title="Close">×</button>
            </div>
          </div>
          
          <div className="chat-body">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.bot ? "bot-message" : "user-message"}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot-message">
                <div className="message-content typing">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form className="chat-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
