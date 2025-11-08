#!/bin/bash

# FleetGrid Quick Start Script
# This script sets up and runs both backend and frontend

echo "🚀 FleetGrid Quick Start"
echo "========================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Python $(python3 --version)"
echo "✅ Node $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -q -r requirements.txt

echo "✅ Backend ready!"
echo ""

# Frontend Setup
echo "📦 Setting up frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies (this may take a few minutes)..."
    npm install
else
    echo "Dependencies already installed"
fi

echo "✅ Frontend ready!"
echo ""

# Instructions
echo "🎉 Setup complete!"
echo ""
echo "To start FleetGrid:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "For automatic start, run: ./start.sh"

