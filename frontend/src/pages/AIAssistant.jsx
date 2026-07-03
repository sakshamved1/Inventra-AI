import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader, Sparkles } from 'lucide-react';
import { Card, Input, Button, Loading } from '../components/UI';
import { Navbar, Sidebar } from '../components/Layout';
import { aiAPI } from '../services/api';

export const AIAssistant = () => {
  const suggestions = [
    'Show available products',
    'What items are low stock?',
    'Explain this project structure',
    'Show recent transactions'
  ];

  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I\'m Inventra AI. I query your live inventory data and current project files to answer questions about stock, transactions, routes, architecture, and app features.' }
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

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.getInventoryInsights(input);
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (content) => {
    return content
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const isBullet = /^[-•]\s+/.test(line);
        const displayText = isBullet ? line.replace(/^[-•]\s+/, '• ') : line;

        return (
          <p
            key={`${line}-${index}`}
            className={`text-sm leading-relaxed ${isBullet ? 'ml-3' : ''}`}
          >
            {displayText}
          </p>
        );
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar activeNav="/ai-assistant" />
      
      <main className="flex h-screen flex-1 flex-col p-4 md:ml-72 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto w-full h-full flex flex-col"
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-2xl bg-blue-600/10 p-2 text-blue-600 dark:text-blue-300">
                <Sparkles size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">AI Assistant</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Ask about inventory, transactions, database health, or your project structure</p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <Card className="flex-1 flex flex-col overflow-hidden border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-xl px-4 py-3 rounded-2xl shadow-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-70">
                      {message.role === 'user' ? 'You' : 'Inventra AI'}
                    </div>
                    <div className="space-y-1">{renderMessageContent(message.content)}</div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 pt-2 pb-3 flex flex-wrap gap-2 border-t border-gray-200 dark:border-gray-600">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-600 p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about stock, transactions, project architecture, or features..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <Button onClick={handleSend} disabled={loading || !input.trim()} className="sm:w-auto w-full">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};
