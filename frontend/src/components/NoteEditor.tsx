"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { createNote } from "@/lib/api";

export default function NoteEditor({ onNoteCreated }: { onNoteCreated: () => void }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createNote(content);
      setContent("");
      onNoteCreated();
    } catch (e) {
      console.error(e);
      alert("Failed to create note! Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-2xl mx-auto w-full group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-zinc-950/80 backdrop-blur-2xl rounded-3xl p-2 border border-white/10 shadow-2xl flex flex-col">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Type a concept, idea or note..."
          className="w-full bg-transparent text-white placeholder-zinc-500 p-4 resize-none focus:outline-none min-h-[120px] text-lg leading-relaxed"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="flex justify-between items-center px-4 pb-2 mt-2">
          <p className="text-xs text-zinc-500 font-medium">✨ AI Extract & Summarize • Cmd + Enter to save</p>
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-5 py-2 rounded-full font-medium transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Save Note
          </button>
        </div>
      </div>
    </motion.div>
  );
}
