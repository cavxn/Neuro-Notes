#!/bin/bash

# Kill dangling processes from previous runs if any
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "Starting NeuroNotes Backend Server (FastAPI)..."
cd "$(dirname "$0")/backend"
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
sleep 2

echo "Starting NeuroNotes Frontend Server (Next.js)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "=========================================="
echo "🧠 NeuroNotes Cognitive Engine is online!"
echo "- App UI: http://localhost:3000"
echo "- API Engine: http://localhost:8000"
echo "- API Docs: http://localhost:8000/docs"
echo "=========================================="

# Wait for process termination
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait $FRONTEND_PID $BACKEND_PID
