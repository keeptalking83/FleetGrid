from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import numpy as np
from datetime import datetime
import json

app = FastAPI(title="FleetGrid API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Coordinates(BaseModel):
    lat: float
    lng: float

class GridBounds(BaseModel):
    top_left: Coordinates
    top_right: Coordinates
    bottom_left: Coordinates
    bottom_right: Coordinates

class GridScores(BaseModel):
    accessibility: float = Field(..., ge=0, le=100)
    demand: float = Field(..., ge=0, le=100)
    operational: float = Field(..., ge=0, le=100)
    final_score: float = Field(..., ge=0, le=100)

class GridFeatures(BaseModel):
    metro_distance: int
    bus_stop_count: int
    building_count: int
    pedestrian_traffic: str
    commercial_ratio: float

class GridCell(BaseModel):
    id: str
    city: str
    district: str
    grid_size: int
    center: Coordinates
    bounds: GridBounds
    scores: GridScores
    features: GridFeatures
    recommended_vehicles: int

class VehiclePlacement(BaseModel):
    vehicle_id: str
    grid_id: str
    position: Coordinates
    battery_level: int
    expected_trips: float
    expected_revenue: float

class DistributionResult(BaseModel):
    optimization_id: str
    timestamp: str
    fleet_size: int
    vehicles: List[VehiclePlacement]
    metrics: Dict[str, float]

class OptimizationRequest(BaseModel):
    city: str
    district: str
    fleet_size: int
    grid_size: int = 500
    min_vehicle_distance: int = 200
    max_vehicles_per_grid: int = 10

class AnalyticsData(BaseModel):
    score_distribution: Dict[str, int]
    coverage_stats: Dict[str, float]
    top_grids: List[Dict]
    revenue_projection: Dict[str, float]

# Sample data generation functions
def generate_kadikoy_grids() -> List[GridCell]:
    """Generate realistic grid data for Kadikoy, Istanbul"""
    
    # Kadikoy coordinates
    base_lat = 40.9887
    base_lng = 29.0238
    
    # Grid size in degrees (approximately 500m)
    grid_size_deg = 0.0045
    
    grids = []
    grid_locations = [
        ("Altiyol Junction", 95.8, 98, 96, 92, 150, 8, 85, "very_high", 0.75, 4),
        ("Bahariye Street", 93.5, 95, 94, 90, 180, 7, 95, "very_high", 0.80, 4),
        ("Moda Pier", 91.2, 88, 96, 88, 300, 5, 65, "very_high", 0.55, 3),
        ("Kadikoy Market", 89.7, 92, 91, 85, 200, 9, 120, "high", 0.70, 3),
        ("Caferaga District", 87.3, 85, 90, 86, 250, 6, 78, "high", 0.65, 2),
        ("Sogutlucesme", 85.9, 90, 86, 82, 180, 8, 88, "high", 0.60, 2),
        ("Moda Street", 84.6, 82, 88, 83, 350, 4, 72, "high", 0.58, 2),
        ("Yeldeğirmeni", 82.1, 78, 85, 81, 400, 5, 95, "medium", 0.50, 2),
        ("Feneryolu", 79.8, 85, 79, 76, 220, 7, 68, "medium", 0.52, 1),
        ("Hasanpaşa", 77.4, 80, 78, 75, 280, 6, 82, "medium", 0.48, 1),
        ("Fikirtepe", 74.2, 75, 76, 72, 320, 5, 90, "medium", 0.45, 1),
        ("Rasimpaşa", 71.8, 72, 74, 70, 380, 4, 65, "medium", 0.42, 1),
        ("Göztepe", 69.5, 78, 68, 68, 250, 6, 58, "low", 0.38, 1),
        ("Kozyatağı North", 67.3, 70, 67, 66, 420, 3, 48, "low", 0.35, 1),
        ("Bostancı Beach", 88.9, 86, 92, 87, 280, 5, 42, "high", 0.60, 2),
        ("Caddebostan", 85.2, 88, 85, 84, 240, 7, 55, "high", 0.62, 2),
        ("Suadiye", 82.7, 82, 84, 81, 260, 6, 62, "medium", 0.55, 2),
        ("Erenköy", 79.9, 79, 81, 78, 300, 5, 70, "medium", 0.50, 1),
        ("Koşuyolu", 76.5, 74, 78, 75, 340, 4, 58, "medium", 0.47, 1),
        ("Acıbadem", 73.8, 76, 73, 72, 290, 6, 52, "low", 0.43, 1),
    ]
    
    for idx, (name, final_score, access, demand, oper, metro_dist, bus_count, 
              building_count, ped_traffic, comm_ratio, vehicles) in enumerate(grid_locations):
        
        # Calculate grid position - organized in a grid pattern
        row = idx // 5
        col = idx % 5
        # Small variation but keep on land
        lat_offset = (np.random.random() - 0.5) * 0.001  # Very small variation
        lng_offset = (np.random.random() - 0.5) * 0.001
        center_lat = base_lat + (row * grid_size_deg * 0.8) + lat_offset
        center_lng = base_lng + (col * grid_size_deg * 0.6) + lng_offset
        
        half_grid = grid_size_deg / 2
        
        grid = GridCell(
            id=f"KD_{chr(65+row)}{col+1}",
            city="Istanbul",
            district="Kadikoy",
            grid_size=500,
            center=Coordinates(lat=center_lat, lng=center_lng),
            bounds=GridBounds(
                top_left=Coordinates(lat=center_lat + half_grid, lng=center_lng - half_grid),
                top_right=Coordinates(lat=center_lat + half_grid, lng=center_lng + half_grid),
                bottom_left=Coordinates(lat=center_lat - half_grid, lng=center_lng - half_grid),
                bottom_right=Coordinates(lat=center_lat - half_grid, lng=center_lng + half_grid)
            ),
            scores=GridScores(
                accessibility=access,
                demand=demand,
                operational=oper,
                final_score=final_score
            ),
            features=GridFeatures(
                metro_distance=metro_dist,
                bus_stop_count=bus_count,
                building_count=building_count,
                pedestrian_traffic=ped_traffic,
                commercial_ratio=comm_ratio
            ),
            recommended_vehicles=vehicles
        )
        grids.append(grid)
    
    return grids

def optimize_vehicle_distribution(
    grids: List[GridCell],
    fleet_size: int,
    min_distance: int,
    max_per_grid: int
) -> DistributionResult:
    """Optimize vehicle distribution across grids"""
    
    # Sort grids by score
    sorted_grids = sorted(grids, key=lambda g: g.scores.final_score, reverse=True)
    
    vehicles = []
    vehicle_count = 0
    used_positions = []
    
    for grid in sorted_grids:
        if vehicle_count >= fleet_size:
            break
            
        # Determine how many vehicles for this grid
        vehicles_for_grid = min(
            grid.recommended_vehicles,
            max_per_grid,
            fleet_size - vehicle_count
        )
        
        for i in range(vehicles_for_grid):
            # Generate position with small random offset
            offset = 0.0002 * i
            position = Coordinates(
                lat=grid.center.lat + (np.random.random() - 0.5) * offset,
                lng=grid.center.lng + (np.random.random() - 0.5) * offset
            )
            
            # Check minimum distance constraint
            too_close = False
            for used_pos in used_positions:
                distance = calculate_distance(position, used_pos)
                if distance < min_distance:
                    too_close = True
                    break
            
            if too_close:
                continue
            
            # Calculate expected metrics based on grid score
            score_factor = grid.scores.final_score / 100
            expected_trips = 5 + (score_factor * 8)  # 5-13 trips per day
            trip_revenue = 50  # Average ₺50 per trip
            
            vehicle = VehiclePlacement(
                vehicle_id=f"v_{vehicle_count+1:03d}",
                grid_id=grid.id,
                position=position,
                battery_level=int(70 + np.random.random() * 30),
                expected_trips=round(expected_trips, 1),
                expected_revenue=round(expected_trips * trip_revenue, 2)
            )
            
            vehicles.append(vehicle)
            used_positions.append(position)
            vehicle_count += 1
            
            if vehicle_count >= fleet_size:
                break
    
    # Calculate metrics
    total_revenue = sum(v.expected_revenue for v in vehicles)
    avg_trips = np.mean([v.expected_trips for v in vehicles])
    covered_grids = len(set(v.grid_id for v in vehicles))
    coverage_pct = (covered_grids / len(grids)) * 100
    
    avg_grid_score = np.mean([
        g.scores.final_score for g in grids 
        if any(v.grid_id == g.id for v in vehicles)
    ])
    
    return DistributionResult(
        optimization_id=f"opt_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        timestamp=datetime.now().isoformat(),
        fleet_size=fleet_size,
        vehicles=vehicles,
        metrics={
            "total_expected_revenue": round(total_revenue, 2),
            "avg_trips_per_vehicle": round(avg_trips, 2),
            "coverage_percentage": round(coverage_pct, 2),
            "avg_score_covered": round(avg_grid_score, 2),
            "grids_covered": covered_grids
        }
    )

def calculate_distance(pos1: Coordinates, pos2: Coordinates) -> float:
    """Calculate distance in meters between two coordinates"""
    R = 6371000  # Earth radius in meters
    lat1, lon1 = np.radians(pos1.lat), np.radians(pos1.lng)
    lat2, lon2 = np.radians(pos2.lat), np.radians(pos2.lng)
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    
    return R * c

# API Endpoints
@app.get("/")
def root():
    return {
        "name": "FleetGrid API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/api/grids", response_model=List[GridCell])
def get_grids(city: str = "Istanbul", district: str = "Kadikoy"):
    """Get all grid cells for a city/district"""
    if city.lower() == "istanbul" and district.lower() == "kadikoy":
        return generate_kadikoy_grids()
    else:
        raise HTTPException(status_code=404, detail="City/district not found")

@app.post("/api/optimize", response_model=DistributionResult)
def optimize_distribution(request: OptimizationRequest):
    """Optimize vehicle distribution"""
    grids = generate_kadikoy_grids()
    
    result = optimize_vehicle_distribution(
        grids=grids,
        fleet_size=request.fleet_size,
        min_distance=request.min_vehicle_distance,
        max_per_grid=request.max_vehicles_per_grid
    )
    
    return result

@app.get("/api/analytics", response_model=AnalyticsData)
def get_analytics(city: str = "Istanbul", district: str = "Kadikoy"):
    """Get analytics data for dashboard"""
    grids = generate_kadikoy_grids()
    
    # Score distribution
    score_ranges = {
        "90-100": 0,
        "80-89": 0,
        "70-79": 0,
        "60-69": 0,
        "0-59": 0
    }
    
    for grid in grids:
        score = grid.scores.final_score
        if score >= 90:
            score_ranges["90-100"] += 1
        elif score >= 80:
            score_ranges["80-89"] += 1
        elif score >= 70:
            score_ranges["70-79"] += 1
        elif score >= 60:
            score_ranges["60-69"] += 1
        else:
            score_ranges["0-59"] += 1
    
    # Coverage stats
    scores = [g.scores.final_score for g in grids]
    coverage_stats = {
        "total_grids": len(grids),
        "avg_score": round(np.mean(scores), 2),
        "max_score": round(np.max(scores), 2),
        "min_score": round(np.min(scores), 2),
        "std_dev": round(np.std(scores), 2)
    }
    
    # Top grids
    top_grids = sorted(grids, key=lambda g: g.scores.final_score, reverse=True)[:10]
    top_grids_data = [
        {
            "id": g.id,
            "location": f"{g.district}",
            "score": round(g.scores.final_score, 1),
            "accessibility": round(g.scores.accessibility, 1),
            "demand": round(g.scores.demand, 1),
            "operational": round(g.scores.operational, 1)
        }
        for g in top_grids
    ]
    
    # Revenue projection
    total_recommended_vehicles = sum(g.recommended_vehicles for g in grids)
    avg_trips_per_vehicle = 8.5
    avg_revenue_per_trip = 50
    
    daily_revenue = total_recommended_vehicles * avg_trips_per_vehicle * avg_revenue_per_trip
    
    revenue_projection = {
        "daily": round(daily_revenue, 2),
        "weekly": round(daily_revenue * 7, 2),
        "monthly": round(daily_revenue * 30, 2),
        "yearly": round(daily_revenue * 365, 2)
    }
    
    return AnalyticsData(
        score_distribution=score_ranges,
        coverage_stats=coverage_stats,
        top_grids=top_grids_data,
        revenue_projection=revenue_projection
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

