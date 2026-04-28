from fastapi import APIRouter, HTTPException
from models import NoteBase, NoteResponse, GraphData
from services.nlp_service import process_note_text
from services.graph_service import save_note_with_concepts, get_recent_notes, get_full_graph, get_revision_notes, delete_note_from_db, search_nodes_in_db
from typing import List

router = APIRouter()

@router.post("/create", response_model=NoteResponse)
async def create_note(note: NoteBase):
    nlp_result = process_note_text(note.content)
    
    # Store to DB
    result = save_note_with_concepts(
        content=note.content,
        summary=nlp_result['summary'],
        concepts=nlp_result['concepts']
    )
    return result

@router.get("/", response_model=List[NoteResponse])
async def list_notes():
    notes = get_recent_notes(limit=50)
    return notes

@router.get("/search", response_model=List[NoteResponse])
async def search_notes(q: str):
    if not q:
        return []
    return search_nodes_in_db(q)

@router.get("/revision", response_model=List[NoteResponse])
async def revision_notes():
    return get_revision_notes(limit=3)

@router.get("/graph", response_model=GraphData)
async def get_graph():
    return get_full_graph()

@router.delete("/{note_id}")
async def delete_note(note_id: str):
    try:
        delete_note_from_db(note_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
