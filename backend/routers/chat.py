from pydantic import BaseModel
from fastapi import APIRouter
from services.graph_service import get_full_graph
from services.nlp_service import extract_concepts

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_with_memory(req: ChatRequest):
    message = req.message.lower()
    graph = get_full_graph()
    nodes = graph.get("nodes", [])
    
    # Offline heuristic companion using SpaCy graph queries
    concepts = extract_concepts(req.message)
    
    found_nodes = []
    if concepts:
        for c in concepts:
            matches = [n for n in nodes if c.lower() in n["label"].lower()]
            found_nodes.extend(matches)
            
    if "expand" in message or "more" in message:
        if found_nodes:
            lbl = found_nodes[0]['label']
            return {"reply": f"To expand on '{lbl}', consider linking it to other nodes in your Cognitive Map. (Try adding notes discussing its origin or consequences!)"}
        return {"reply": "Could you specify which concept you want me to expand upon?"}
        
    if "explain" in message:
        return {"reply": "I see you're analyzing your notes. (Since we are offline without OpenAI, I'll prompt you to introspect your map. It looks structurally sound but lacks deeper depth)."}
        
    if "gap" in message or "missing" in message:
        return {"reply": "Looking at your map, try finding isolated topics that aren't linked via 'CONTAINS' to parent concepts. Expanding those will thicken your graph!"}
        
    if found_nodes:
        labels = list(set([n['label'] for n in found_nodes]))
        return {"reply": f"I see you're talking about: {', '.join(labels)}. This is actively tracked in your Knowledge Graph! Want me to find gaps?"}
        
    return {"reply": "I am your Cognitive Companion (Offline Edition). I analyze your inputs using SpaCy NLP. Ask me to 'find gaps', 'expand ideas', or analyze your current map!"}
