#!/bin/bash

# FleetGrid Startup Script
# Starts both backend and frontend in background

echo "🚀 Starting FleetGrid..."
echo ""

# Start Backend
echo "Starting backend on port 8000..."
cd backend
source venv/bin/activate
python main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend running (PID: $BACKEND_PID)"
else
    echo "❌ Backend failed to start. Check backend.log"
    exit 1
fi

# Start Frontend
echo "Starting frontend on port 3000..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 5

# Check if frontend is running
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "✅ Frontend running (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend failed to start. Check frontend.log"
    kill $BACKEND_PID
    exit 1
fi

echo ""
echo "🎉 FleetGrid is running!"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Process IDs:"
echo "  Backend:  $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo "To stop: ./stop.sh"
echo "Logs: backend.log, frontend.log"
echo ""

# Save PIDs
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# Open browser (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    sleep 2
    open http://localhost:3000
fi

