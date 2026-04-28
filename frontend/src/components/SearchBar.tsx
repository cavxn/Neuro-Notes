"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { searchNotes, Note } from "@/lib/api";
import NoteCard from "./NoteCard";

export default function SearchBar({ onConceptClick }: { onConceptClick?: (c: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchNotes(query);
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* Global trigger button if mobile or explicit click */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 p-3 bg-zinc-900/80 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all z-40 backdrop-blur-md shadow-2xl flex items-center gap-2"
      >
        <Search size={20} />
        <span className="text-sm font-medium pr-2 hidden md:inline">Cmd + K</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl bg-zinc-950/90 border border-indigo-500/30 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[70vh]">
            <div className="flex items-center px-6 py-4 border-b border-white/10 bg-white/5">
              <Search className="text-indigo-400 mr-3" size={24} />
              <input
                autoFocus
                type="text"
                placeholder="Search notes, concepts, or memories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white text-lg placeholder:text-zinc-500 focus:outline-none"
              />
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-zinc-900/50">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {results.map((note) => (
                    <NoteCard key={`search-${note.id}`} note={note} onConceptClick={(c) => { onConceptClick?.(c); setIsOpen(false); }} />
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="text-center py-12 text-zinc-500">
                  No semantic matches found for "{query}".
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-600 flex flex-col items-center gap-2">
                   <Search size={32} className="opacity-50" />
                   <p>Start typing to search your cognitive graph.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
