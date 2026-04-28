"use client";

import { useEffect, useState } from "react";
import NoteEditor from "@/components/NoteEditor";
import NoteCard from "@/components/NoteCard";
import GraphVisualizer from "@/components/GraphVisualizer";
import AIChatPanel from "@/components/AIChatPanel";
import RevisionPanel from "@/components/RevisionPanel";
import SearchBar from "@/components/SearchBar";
import { fetchNotes, deleteNote, Note } from "@/lib/api";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const loadNotes = async () => {
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      loadNotes(); // Refresh DB
    } catch(e) {
      console.error(e);
    }
  };

  const displayedNotes = activeFilter 
    ? notes.filter(n => n.concepts.some(c => c.name === activeFilter))
    : notes;

  return (
    <main className="min-h-screen bg-[#0a0a0c] selection:bg-indigo-500/30 text-white antialiased relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/30 via-purple-500/10 to-transparent blur-3xl rounded-full"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-12 z-10">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            NeuroNotes
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto font-medium">
            A cognitive-aware thinking system. Just write, and the engine extracts concepts and builds memory graphs.
          </p>
        </header>

        <section className="mb-24">
          <NoteEditor onNoteCreated={loadNotes} />
        </section>

        <RevisionPanel />

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white/90">
              {activeFilter ? (
                 <span className="flex items-center gap-2">
                   Filtered by: <span className="text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg text-xl">{activeFilter}</span>
                   <button onClick={() => setActiveFilter(null)} className="text-sm border border-white/10 px-3 py-1 rounded-full text-zinc-400 hover:text-white uppercase ml-2">Clear</button>
                 </span>
              ) : "Knowledge Graph Inbox"}
            </h2>
            <div className="text-sm text-zinc-400 bg-zinc-900/80 px-4 py-1.5 rounded-full border border-white/10 shadow-inner font-medium">
              {displayedNotes.length} Nodes Found
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => (
                 <div key={i} className="bg-zinc-900/50 h-56 rounded-3xl border border-white/5"></div>
              ))}
            </div>
          ) : displayedNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onDelete={handleDelete} onConceptClick={setActiveFilter} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
               <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                 <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
               </div>
               <p className="text-zinc-400 font-medium text-lg mb-1">Your knowledge graph is clear.</p>
               <p className="text-zinc-500 text-sm">Start adding notes above to populate it.</p>
            </div>
          )}
        </section>

        <section className="mt-24 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white/90">Cognitive Map</h2>
            <div className="text-sm text-zinc-400 font-medium px-4 py-1.5 bg-zinc-900/60 rounded-full border border-white/10">NLP Powered Graph</div>
          </div>
          {notes.length > 0 ? (
            <GraphVisualizer />
          ) : (
             <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
               <p className="text-zinc-500 font-medium">Add notes to build your concept map.</p>
             </div>
          )}
        </section>

        <SearchBar onConceptClick={setActiveFilter} />
        <AIChatPanel />
      </div>
    </main>
  );
}
