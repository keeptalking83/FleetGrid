import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { AnalyticsData, DistributionResult } from '../types';

interface AnalyticsPanelProps {
  analytics: AnalyticsData | null;
  distribution: DistributionResult | null;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPanel({ analytics, distribution }: AnalyticsPanelProps) {
  if (!analytics) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare score distribution data for chart
  const scoreDistData = Object.entries(analytics.score_distribution).map(([range, count]) => ({
    name: range,
    value: count,
  }));

  // Prepare top grids data
  const topGridsData = analytics.top_grids.slice(0, 5).map((grid) => ({
    name: grid.id,
    score: grid.score,
  }));

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
        </div>
        <p className="text-sm text-gray-400">Real-time insights and metrics</p>
      </div>

      {/* Score Distribution */}
      <div className="bg-dark-hover border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center">
          <Target className="w-4 h-4 mr-2 text-purple-400" />
          Score Distribution
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={scoreDistData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11 }} />
            <YAxis tick={{ fill: '#888', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Performing Grids */}
      <div className="bg-dark-hover border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center">
          <Award className="w-4 h-4 mr-2 text-yellow-400" />
          Top 5 Grids
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topGridsData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis type="number" tick={{ fill: '#888', fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#888', fontSize: 11 }} width={50} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Projection */}
      <div className="bg-dark-hover border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-green-400" />
          Revenue Projection
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark-surface rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Daily</p>
            <p className="text-lg font-bold">₺{(analytics.revenue_projection.daily / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-dark-surface rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Weekly</p>
            <p className="text-lg font-bold">₺{(analytics.revenue_projection.weekly / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-dark-surface rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Monthly</p>
            <p className="text-lg font-bold">₺{(analytics.revenue_projection.monthly / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-dark-surface rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Yearly</p>
            <p className="text-lg font-bold">₺{(analytics.revenue_projection.yearly / 1000000).toFixed(2)}M</p>
          </div>
        </div>
      </div>

      {/* Optimization Results */}
      {distribution && (
        <div className="bg-dark-hover border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-4">Optimization Results</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Optimization ID</span>
              <span className="font-mono text-xs">{distribution.optimization_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vehicles Deployed</span>
              <span className="font-medium">{distribution.fleet_size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Grids Covered</span>
              <span className="font-medium">{distribution.metrics.grids_covered}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Coverage</span>
              <span className="font-medium text-green-400">
                {distribution.metrics.coverage_percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Trips/Vehicle</span>
              <span className="font-medium">{distribution.metrics.avg_trips_per_vehicle.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Expected Daily Revenue</span>
              <span className="font-medium text-green-400">
                ₺{distribution.metrics.total_expected_revenue.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Grid Score</span>
              <span className="font-medium">{distribution.metrics.avg_score_covered.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Coverage Stats */}
      <div className="bg-dark-hover border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Coverage Statistics</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Grids</span>
            <span className="font-medium">{analytics.coverage_stats.total_grids}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Average Score</span>
            <span className="font-medium">{analytics.coverage_stats.avg_score.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Max Score</span>
            <span className="font-medium text-purple-400">{analytics.coverage_stats.max_score.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Min Score</span>
            <span className="font-medium text-red-400">{analytics.coverage_stats.min_score.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Std Deviation</span>
            <span className="font-medium">{analytics.coverage_stats.std_dev.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Top Grids List */}
      <div className="bg-dark-hover border border-dark-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Top 10 Grids</h3>
        <div className="space-y-2">
          {analytics.top_grids.map((grid, idx) => (
            <div
              key={grid.id}
              className="flex items-center justify-between p-2 bg-dark-surface rounded-lg hover:bg-dark-bg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{grid.id}</p>
                  <p className="text-xs text-gray-500">{grid.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{grid.score.toFixed(1)}</p>
                <p className="text-xs text-gray-500">score</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

