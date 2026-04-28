from pydantic import BaseModel
from typing import List, Optional

class Concept(BaseModel):
    id: str
    name: str

class NoteBase(BaseModel):
    content: str

class NoteResponse(BaseModel):
    id: str
    content: str
    summary: str
    created_at: str
    concepts: List[Concept]

class GraphNode(BaseModel):
    id: str
    label: str
    name: Optional[str] = None
    group: str

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
