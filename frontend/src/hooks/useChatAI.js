// src/hooks/useChatAI.js
import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

export const useChatAI = (page = "General") => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm BuydoraBot 🛍️ How can I help you today?", bot: true }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMsg = { text, bot: false };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      console.log("🚀 Sending request to:", `${BACKEND_URL}/api/ai/generate-description`);
      
      const response = await fetch(`${BACKEND_URL}/api/ai/generate-description`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
          // NO Authorization header - handled by backend
        },
        body: JSON.stringify({
          productName: text,
          category: page,
          features: text
        })
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Response data:", data);

      if (!data.success) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add bot response
      setMessages((prev) => [
        ...prev,
        { text: data.description, bot: true }
      ]);

    } catch (err) {
      console.error("💥 Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { text: `Sorry, something went wrong: ${err.message}`, bot: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { text: "Hi! I'm BuydoraBot 🛍️ How can I help you today?", bot: true }
    ]);
  };

  return { messages, sendMessage, loading, clearChat };
};

export default useChatAI;
