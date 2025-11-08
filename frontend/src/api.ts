import axios from 'axios';
import { GridCell, DistributionResult, AnalyticsData } from './types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getGrids = async (city: string = 'Istanbul', district: string = 'Kadikoy'): Promise<GridCell[]> => {
  const response = await api.get('/api/grids', {
    params: { city, district },
  });
  return response.data;
};

export const optimizeDistribution = async (params: {
  city: string;
  district: string;
  fleet_size: number;
  grid_size?: number;
  min_vehicle_distance?: number;
  max_vehicles_per_grid?: number;
}): Promise<DistributionResult> => {
  const response = await api.post('/api/optimize', params);
  return response.data;
};

export const getAnalytics = async (city: string = 'Istanbul', district: string = 'Kadikoy'): Promise<AnalyticsData> => {
  const response = await api.get('/api/analytics', {
    params: { city, district },
  });
  return response.data;
};

