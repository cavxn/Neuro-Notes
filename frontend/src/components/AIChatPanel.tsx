"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { sendChatMessage } from '@/lib/api';

export default function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: "Hello! I'm your offline Cognitive Companion. How can I help you explore your knowledge graph today? (Try: 'find gaps', 'explain')" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    try {
      const reply = await sendChatMessage(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to my local heuristic brain." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-full shadow-2xl transition-transform hover:scale-110 z-40 flex items-center justify-center ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-80 md:w-96 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden h-[500px]"
          >
            <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bot className="text-indigo-400" size={20} />
                <h3 className="font-bold text-white text-sm">Cognitive Companion</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 relative">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md' : 'bg-zinc-800 text-zinc-200 rounded-tl-sm shadow-md'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl max-w-[85%] text-sm bg-zinc-800 text-zinc-200 rounded-tl-sm animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 bg-white/5 pb-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me something..."
                  className="w-full bg-zinc-900 text-white rounded-full pl-4 pr-12 py-3 border border-white/10 focus:outline-none focus:border-indigo-500/50 text-sm shadow-inner transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex items-center justify-center"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
