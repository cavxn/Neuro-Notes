"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Note } from "@/lib/api";

type NoteCardProps = {
  note: Note;
  onDelete?: (id: string) => void;
  onConceptClick?: (conceptName: string) => void;
};

export default function NoteCard({ note, onDelete, onConceptClick }: NoteCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-2">
        <p className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
          {new Date(note.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        {onDelete && (
           <button 
             onClick={() => onDelete(note.id)}
             className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all absolute top-4 right-4 bg-zinc-900/80 p-2 rounded-full border border-white/10"
           >
             <Trash2 size={14} />
           </button>
        )}
      </div>
      
      <p className="text-xl font-bold text-slate-100 mb-3 leading-tight tracking-tight">
        {note.summary}
      </p>
      
      <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed">
        {note.content}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
        {note.concepts.length > 0 ? note.concepts.map((concept) => (
          <button 
            key={concept.id}
            onClick={() => onConceptClick?.(concept.name)}
            className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 hover:text-white rounded-lg text-xs font-medium border border-indigo-500/30 shadow-inner transition-colors"
          >
            {concept.name}
          </button>
        )) : (
          <span className="px-2.5 py-1 text-slate-500 text-xs italic">No concepts extracted</span>
        )}
      </div>
    </motion.div>
  );
}
