export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GridBounds {
  top_left: Coordinates;
  top_right: Coordinates;
  bottom_left: Coordinates;
  bottom_right: Coordinates;
}

export interface GridScores {
  accessibility: number;
  demand: number;
  operational: number;
  final_score: number;
}

export interface GridFeatures {
  metro_distance: number;
  bus_stop_count: number;
  building_count: number;
  pedestrian_traffic: string;
  commercial_ratio: number;
}

export interface GridCell {
  id: string;
  city: string;
  district: string;
  grid_size: number;
  center: Coordinates;
  bounds: GridBounds;
  scores: GridScores;
  features: GridFeatures;
  recommended_vehicles: number;
}

export interface VehiclePlacement {
  vehicle_id: string;
  grid_id: string;
  position: Coordinates;
  battery_level: number;
  expected_trips: number;
  expected_revenue: number;
}

export interface DistributionResult {
  optimization_id: string;
  timestamp: string;
  fleet_size: number;
  vehicles: VehiclePlacement[];
  metrics: {
    total_expected_revenue: number;
    avg_trips_per_vehicle: number;
    coverage_percentage: number;
    avg_score_covered: number;
    grids_covered: number;
  };
}

export interface AnalyticsData {
  score_distribution: Record<string, number>;
  coverage_stats: {
    total_grids: number;
    avg_score: number;
    max_score: number;
    min_score: number;
    std_dev: number;
  };
  top_grids: Array<{
    id: string;
    location: string;
    score: number;
    accessibility: number;
    demand: number;
    operational: number;
  }>;
  revenue_projection: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

