// src/components/Chat/ChatWidget.jsx
import React, { useState } from "react";
import { useChatAI } from "../../hooks/useChatAI";

const ChatWidget = ({ page }) => {
  const { messages, sendMessage } = useChatAI(page);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const handleSend = async () => {
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        >
          💬 Chat
        </button>
      ) : (
        <div className="bg-white w-80 h-96 rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-600 text-white px-3 py-2 font-bold rounded-t">
            Assistant
            <button
              className="float-right text-sm"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  msg.bot
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800 text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="border-t px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
