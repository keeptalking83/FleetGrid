import { useState, useEffect } from 'react';
import { MapPin, Activity, DollarSign, TrendingUp, Zap } from 'lucide-react';
import MapView from './components/MapView';
import StatsCard from './components/StatsCard';
import ControlPanel from './components/ControlPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import { getGrids, optimizeDistribution, getAnalytics } from './api';
import { GridCell, DistributionResult, AnalyticsData } from './types';

function App() {
  const [grids, setGrids] = useState<GridCell[]>([]);
  const [distribution, setDistribution] = useState<DistributionResult | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fleetSize, setFleetSize] = useState(50);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gridsData, analyticsData] = await Promise.all([
        getGrids(),
        getAnalytics()
      ]);
      setGrids(gridsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async (fleet: number) => {
    setLoading(true);
    try {
      const result = await optimizeDistribution({
        city: 'Istanbul',
        district: 'Kadikoy',
        fleet_size: fleet,
        grid_size: 500,
        min_vehicle_distance: 200,
        max_vehicles_per_grid: 10,
      });
      setDistribution(result);
      setFleetSize(fleet);
    } catch (error) {
      console.error('Error optimizing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">FleetGrid</h1>
                <p className="text-sm text-gray-400">Smart Fleet Location Optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-dark-hover rounded-lg border border-dark-border">
                <span className="text-sm text-gray-400">Location:</span>
                <span className="ml-2 font-medium">Istanbul, Kadikoy</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="px-6 py-6 border-b border-dark-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            icon={<Activity className="w-5 h-5" />}
            label="Total Grids"
            value={analytics?.coverage_stats.total_grids.toString() || '0'}
            change="+20 from last scan"
            color="blue"
          />
          <StatsCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Avg Grid Score"
            value={analytics?.coverage_stats.avg_score.toFixed(1) || '0'}
            change="+5.2% this week"
            color="green"
          />
          <StatsCard
            icon={<MapPin className="w-5 h-5" />}
            label="Vehicles Deployed"
            value={distribution?.fleet_size.toString() || fleetSize.toString()}
            change={distribution ? `${distribution.metrics.grids_covered} grids` : 'Not optimized'}
            color="purple"
          />
          <StatsCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Expected Revenue"
            value={distribution ? `₺${(distribution.metrics.total_expected_revenue / 1000).toFixed(1)}K` : '₺0'}
            change="per day"
            color="yellow"
          />
          <StatsCard
            icon={<Zap className="w-5 h-5" />}
            label="Coverage"
            value={distribution ? `${distribution.metrics.coverage_percentage.toFixed(1)}%` : '0%'}
            change={distribution ? `Avg score: ${distribution.metrics.avg_score_covered.toFixed(1)}` : 'Optimize to see'}
            color="pink"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-250px)]">
        {/* Control Panel */}
        <div className="w-80 border-r border-dark-border bg-dark-surface overflow-y-auto">
          <ControlPanel
            onOptimize={handleOptimize}
            loading={loading}
            currentFleetSize={fleetSize}
          />
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            grids={grids}
            vehicles={distribution?.vehicles || []}
            loading={loading}
          />
        </div>

        {/* Analytics Panel */}
        <div className="w-96 border-l border-dark-border bg-dark-surface overflow-y-auto">
          <AnalyticsPanel
            analytics={analytics}
            distribution={distribution}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

