const API_URL = 'http://localhost:8000';

export interface Concept {
    id: string;
    name: string;
}

export interface Note {
    id: string;
    content: string;
    summary: string;
    created_at: string;
    concepts: Concept[];
}

export async function createNote(content: string): Promise<Note> {
    const res = await fetch(`${API_URL}/notes/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });
    
    if (!res.ok) {
        throw new Error('Failed to create note');
    }
    return res.json();
}

export async function fetchNotes(): Promise<Note[]> {
    const res = await fetch(`${API_URL}/notes/`, { cache: 'no-store' });
    
    if (!res.ok) {
        throw new Error('Failed to fetch notes');
    }
    return res.json();
}

export async function fetchRevisionNotes(): Promise<Note[]> {
    const res = await fetch(`${API_URL}/notes/revision`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch revision notes');
    }
    return res.json();
}

export async function deleteNote(noteId: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/notes/${noteId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete note');
    return true;
}

export async function searchNotes(query: string): Promise<Note[]> {
    const res = await fetch(`${API_URL}/notes/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search notes');
    return res.json();
}

export interface GraphNode {
    id: string;
    label: string;
    group: string;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    label: string;
}

export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export async function fetchGraph(): Promise<GraphData> {
    const res = await fetch(`${API_URL}/notes/graph`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch graph');
    }
    return res.json();
}

export async function sendChatMessage(message: string): Promise<string> {
    const res = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });
    if (!res.ok) {
        throw new Error('Failed to send chat message');
    }
    const data = await res.json();
    return data.reply;
}
