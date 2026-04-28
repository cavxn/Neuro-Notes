from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import notes, chat

app = FastAPI(title="NeuroNotes API", version="1.0.0")

# CORS setup for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(chat.router, prefix="/chat", tags=["AI Companion"])

@app.get("/")
def read_root():
    return {"message": "NeuroNotes Cognitive Engine is online."}
