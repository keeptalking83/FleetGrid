# FleetGrid Setup Guide

Complete guide to get FleetGrid running on your machine.

## Prerequisites

Before starting, ensure you have:

- **Python 3.11 or higher** ([Download](https://www.python.org/downloads/))
- **Node.js 18 or higher** ([Download](https://nodejs.org/))
- **Git** (optional, for version control)

Check versions:
```bash
python --version
node --version
npm --version
```

## Installation Steps

### Step 1: Backend Setup

1. Navigate to the backend directory:
```bash
cd FleetGrid/backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```
- **Windows**:
  ```bash
  venv\Scripts\activate
  ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Start the backend server:
```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Keep this terminal open. The backend is now running!

### Step 2: Frontend Setup

Open a **new terminal window**.

1. Navigate to the frontend directory:
```bash
cd FleetGrid/frontend
```

2. Install dependencies:
```bash
npm install
```

This might take a few minutes as it downloads all required packages.

3. Start the development server:
```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:3000/
```

### Step 3: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the FleetGrid dashboard!

## Using FleetGrid

### 1. View the Map
- The map shows Istanbul Kadikoy divided into grids
- Colors indicate grid scores (purple = best, red = worst)
- Click on any grid to see detailed information

### 2. Run an Optimization
- In the left panel, set your fleet size (e.g., 50 vehicles)
- Adjust min distance and max vehicles per grid
- Click "Run Optimization"
- Watch as vehicles are placed on the map

### 3. Analyze Results
- The top bar shows key metrics
- Right panel displays analytics and charts
- Score distribution shows grid quality
- Revenue projections show expected earnings

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Make sure virtual environment is activated and run `pip install -r requirements.txt`

**Problem**: Port 8000 already in use
- **Solution**: 
  - Find and kill the process: `lsof -ti:8000 | xargs kill -9` (macOS/Linux)
  - Or change the port in `main.py`: `uvicorn.run(app, host="0.0.0.0", port=8001)`

### Frontend Issues

**Problem**: `Cannot GET /`
- **Solution**: Make sure you ran `npm install` and `npm run dev`

**Problem**: API errors in browser console
- **Solution**: Ensure backend is running on port 8000

**Problem**: Map not loading
- **Solution**: Check your internet connection (map tiles are loaded from OpenStreetMap)

### General Tips

1. Always keep both terminals open (backend and frontend)
2. If you see errors, try restarting both servers
3. Clear browser cache if UI doesn't update
4. Check browser console (F12) for error messages

## Testing the API

You can test the backend API directly:

### Using Browser
Visit: `http://localhost:8000/docs`

This opens the interactive API documentation where you can test all endpoints.

### Using curl
```bash
# Get grids
curl http://localhost:8000/api/grids

# Get analytics
curl http://localhost:8000/api/analytics

# Run optimization
curl -X POST http://localhost:8000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{"city": "Istanbul", "district": "Kadikoy", "fleet_size": 50}'
```

## Next Steps

Once you have the basic system running:

1. **Experiment with different fleet sizes**: Try 25, 50, 100, 200 vehicles
2. **Adjust constraints**: Change min distance and max per grid
3. **Explore the map**: Click on grids and vehicles to see details
4. **Review analytics**: Study the charts to understand grid performance

## Development

### Backend Development
- Main API code: `backend/main.py`
- Models and schemas are defined using Pydantic
- API docs: `http://localhost:8000/docs`

### Frontend Development
- Main app: `frontend/src/App.tsx`
- Components: `frontend/src/components/`
- API calls: `frontend/src/api.ts`
- Types: `frontend/src/types.ts`

### Hot Reload
Both backend and frontend support hot reload - just save your changes and they'll appear automatically!

## Production Deployment

For production deployment:

1. **Backend**:
```bash
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

2. **Frontend**:
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

## Support

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages carefully
3. Ensure all prerequisites are installed
4. Try restarting both servers

---

Happy Optimizing! 🚀

