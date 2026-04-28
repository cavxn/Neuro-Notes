"use client";

import { useEffect, useState } from 'react';
import { fetchRevisionNotes, Note } from '@/lib/api';
import { BrainCircuit } from 'lucide-react';
import NoteCard from './NoteCard';

export default function RevisionPanel() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchRevisionNotes().then(setNotes).catch(console.error);
  }, []);

  if (notes.length === 0) return null;

  return (
    <div className="w-full bg-indigo-950/20 border border-indigo-500/20 backdrop-blur-md rounded-3xl p-6 mb-16 shadow-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 transition-opacity opacity-50 group-hover:opacity-100"></div>
      
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
           <BrainCircuit className="text-indigo-400" size={24} />
        </div>
        <div>
           <h2 className="text-xl font-bold text-white/90">Memory Resurfacing</h2>
           <p className="text-sm text-indigo-200/70 font-medium tracking-wide">SPACED REPETITION QUEUE</p>
        </div>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => <div key={`rev-${note.id}`} className="scale-[0.98] opacity-80 hover:opacity-100 hover:scale-100 transition-all"><NoteCard note={note} /></div>)}
      </div>
    </div>
  );
}
