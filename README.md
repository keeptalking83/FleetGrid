# FleetGrid - Smart Fleet Location Optimization System

FleetGrid is an intelligent location optimization system designed for micro-mobility and shared vehicle companies. It analyzes geographical data to score locations and optimally distribute vehicles across city grids.

![FleetGrid Dashboard](./docs/screenshot.png)

## Features

- **Intelligent Grid Scoring**: Analyzes locations based on accessibility, demand, and operational factors
- **Optimal Distribution**: Advanced algorithms to place vehicles for maximum utilization
- **Real-time Analytics**: Live dashboard with charts and metrics
- **Interactive Map**: Visualize grids and vehicle placements
- **Dark Modern UI**: Beautiful interface inspired by modern dashboards

## Technology Stack

### Backend
- FastAPI (Python)
- NumPy, Pandas, GeoPandas
- Pydantic for data validation

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Leaflet for maps
- Recharts for data visualization

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## Usage

1. **View Grid Analysis**: The map displays all grids colored by their scores
   - Purple: Excellent (90-100)
   - Blue: Very Good (80-89)
   - Green: Good (70-79)
   - Yellow: Fair (60-69)
   - Red: Poor (0-59)

2. **Configure Fleet**: Use the control panel to set:
   - Fleet size
   - Minimum distance between vehicles
   - Maximum vehicles per grid

3. **Run Optimization**: Click "Run Optimization" to distribute vehicles

4. **Analyze Results**: View analytics including:
   - Score distribution
   - Top performing grids
   - Revenue projections
   - Coverage statistics

## API Endpoints

- `GET /api/grids` - Get all grid cells with scores
- `POST /api/optimize` - Run vehicle distribution optimization
- `GET /api/analytics` - Get analytics data

## Sample Data

The system includes realistic sample data for Istanbul Kadikoy:
- 20 grid cells
- Various locations (Altiyol, Bahariye, Moda, etc.)
- Realistic scoring based on transportation, infrastructure, and demographics

## Scoring Algorithm

Each grid receives three scores:

### Accessibility Score (0-100)
- Metro station distance (25%)
- Bus stop distance (15%)
- Train station distance (10%)

### Demand Score (0-100)
- Building density (20%)
- Pedestrian traffic (30%)
- Commercial presence (20%)
- Residential presence (15%)
- Tourist attractions (15%)

### Operational Score (0-100)
- Road accessibility (30%)
- Parking availability (25%)
- Safety indicators (20%)
- Weather exposure (15%)
- Competition density (10%)

**Final Score = (Accessibility × 0.3) + (Demand × 0.5) + (Operational × 0.2)**

## Optimization Constraints

- Total vehicles = fleet size
- Minimum distance between vehicles (default: 200m)
- Maximum vehicles per grid (default: 10)
- Same-side street placement
- No opposite lane violations
- Battery level considerations

## Future Enhancements

- [ ] Real-time demand prediction with ML
- [ ] Weather integration
- [ ] Multi-city support
- [ ] Historical analytics
- [ ] Mobile app for field operations
- [ ] API for third-party integrations
- [ ] White-label solution

## License

MIT License - See LICENSE file for details

## Contact

- Email: hello@fleetgrid.io
- Website: [Coming Soon]

---

Built with ❤️ for the micro-mobility industry

