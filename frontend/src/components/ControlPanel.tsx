import { useState } from 'react';
import { Play, Settings, Info } from 'lucide-react';

interface ControlPanelProps {
  onOptimize: (fleetSize: number) => void;
  loading: boolean;
  currentFleetSize: number;
}

export default function ControlPanel({ onOptimize, loading, currentFleetSize }: ControlPanelProps) {
  const [fleetSize, setFleetSize] = useState(currentFleetSize);
  const [minDistance, setMinDistance] = useState(200);
  const [maxPerGrid, setMaxPerGrid] = useState(10);

  const handleOptimize = () => {
    onOptimize(fleetSize);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Settings className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Optimization Control</h2>
        </div>
        <p className="text-sm text-gray-400">Configure and run vehicle distribution</p>
      </div>

      {/* Fleet Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Fleet Size
        </label>
        <input
          type="number"
          value={fleetSize}
          onChange={(e) => setFleetSize(Number(e.target.value))}
          className="w-full px-4 py-2 bg-dark-hover border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          min="1"
          max="500"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Min: 1</span>
          <span>Max: 500</span>
        </div>
      </div>

      {/* Min Distance Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Min Vehicle Distance: {minDistance}m
        </label>
        <input
          type="range"
          value={minDistance}
          onChange={(e) => setMinDistance(Number(e.target.value))}
          className="w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer accent-purple-500"
          min="100"
          max="500"
          step="50"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>100m</span>
          <span>500m</span>
        </div>
      </div>

      {/* Max Per Grid */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Max Vehicles Per Grid: {maxPerGrid}
        </label>
        <input
          type="range"
          value={maxPerGrid}
          onChange={(e) => setMaxPerGrid(Number(e.target.value))}
          className="w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer accent-purple-500"
          min="1"
          max="20"
          step="1"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      {/* Optimize Button */}
      <button
        onClick={handleOptimize}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all"
      >
        <Play className="w-5 h-5" />
        <span>{loading ? 'Optimizing...' : 'Run Optimization'}</span>
      </button>

      {/* Constraints Info */}
      <div className="bg-dark-hover border border-dark-border rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium">Active Constraints</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Grid Size</span>
            <span className="font-medium">500m × 500m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Same Side Street</span>
            <span className="font-medium text-green-400">✓ Enabled</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Avoid Opposite Lanes</span>
            <span className="font-medium text-green-400">✓ Enabled</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Min Battery Level</span>
            <span className="font-medium">20%</span>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-300">Quick Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setFleetSize(25)}
            className="px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-sm hover:border-purple-500 transition-colors"
          >
            Small (25)
          </button>
          <button
            onClick={() => setFleetSize(50)}
            className="px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-sm hover:border-purple-500 transition-colors"
          >
            Medium (50)
          </button>
          <button
            onClick={() => setFleetSize(100)}
            className="px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-sm hover:border-purple-500 transition-colors"
          >
            Large (100)
          </button>
          <button
            onClick={() => setFleetSize(200)}
            className="px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-sm hover:border-purple-500 transition-colors"
          >
            XL (200)
          </button>
        </div>
      </div>
    </div>
  );
}

