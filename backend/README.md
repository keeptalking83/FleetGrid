# FleetGrid Backend API

FastAPI-based backend for the FleetGrid vehicle optimization system.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
python main.py
```

API will be available at http://localhost:8000
API docs at http://localhost:8000/docs

## Endpoints

- `GET /api/grids` - Get all grid cells
- `POST /api/optimize` - Optimize vehicle distribution
- `GET /api/analytics` - Get analytics data

