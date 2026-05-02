'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';
import Groq from 'groq-sdk';

export default function OrderChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm here to help with your order tracking. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = async (userMessage) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      
      if (!apiKey) {
        return '⚠️ Groq API key not configured. Please add NEXT_PUBLIC_GROQ_API_KEY to .env.local';
      }

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const context = `
You are a helpful support chatbot for Cheap Chip, a recycling marketplace.
Help users with questions about order tracking, repairs, shipping, returns, refunds, and support.
Keep responses concise (1-3 sentences), friendly, and use emoji when appropriate.
Support both English and Bengali.
`;

      const messages = [
        {
          role: 'user',
          content: `${context}\n\nUser question: ${userMessage}`,
        },
      ];

      const response = await groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 150,
      });

      return response.choices[0].message.content || 'Sorry, I couldn\'t generate a response.';
    } catch (error) {
      console.error('Groq API error:', error);
      // Fallback to keyword matching
      return getFallbackResponse(userMessage);
    }
  };

  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();

    const responses = {
      'how long': 'Typical shipping takes 5-7 business days.',
      'tracking': 'Enter your Order ID or 6-digit repair tracking ID in the search box above.',
      'status': 'Your order goes: Ordered → Confirmed → Processing → Shipped → Delivered',
      'cost': '💵 Check your repair details above for pricing.',
      'price': '💵 Check your repair details above for pricing.',
      'cancel': 'Contact support@cheapchip.com with your Order ID to cancel.',
      'refund': 'Refunds process within 7-10 business days after return.',
      'lost': 'Contact support if your package appears lost.',
      'contact': 'Email: support@cheapchip.com | Phone: +880-1234-567890',
      'return': 'Returns accepted within 30 days in original condition.',
      'warranty': 'All products have 1-year warranty.',
      'hello': 'Hello! 👋 How can I help?',
      'help': 'I can help with: tracking, shipping, status, returns, refunds, cost.',
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    return '🤔 Ask about: tracking, shipping, status, cost, returns, or contact support!';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const botResponseText = await getBotResponse(input);
      const botResponse = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = {
        id: messages.length + 2,
        text: '❌ Error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
          title="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 max-h-150 flex flex-col shadow-2xl border-green-200">
          {/* Header */}
          <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white p-4 flex justify-between items-center rounded-t-lg">
            <div>
              <h3 className="font-semibold">Order Tracking Assistant</h3>
              <p className="text-xs opacity-90">Always here to help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-700 p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t bg-white p-3 flex gap-2 rounded-b-lg"
          >
            <Input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
