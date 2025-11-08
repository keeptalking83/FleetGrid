import { useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GridCell, VehiclePlacement } from '../types';
import { Loader } from 'lucide-react';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  grids: GridCell[];
  vehicles: VehiclePlacement[];
  loading: boolean;
}

// Component to fit bounds
function MapController({ grids }: { grids: GridCell[] }) {
  const map = useMap();

  useEffect(() => {
    if (grids.length > 0) {
      const bounds = grids.map(g => [g.center.lat, g.center.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [grids, map]);

  return null;
}

// Get color based on score
function getScoreColor(score: number): string {
  if (score >= 90) return '#8b5cf6'; // purple
  if (score >= 80) return '#3b82f6'; // blue
  if (score >= 70) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // yellow
  return '#ef4444'; // red
}

// Get opacity based on score
function getScoreOpacity(score: number): number {
  return 0.2 + (score / 100) * 0.4;
}

export default function MapView({ grids, vehicles, loading }: MapViewProps) {
  const defaultCenter: [number, number] = [40.9887, 29.0238];
  const defaultZoom = 13;

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-dark-surface border border-dark-border rounded-lg px-4 py-2 flex items-center space-x-2">
          <Loader className="w-4 h-4 animate-spin text-purple-400" />
          <span className="text-sm">Loading data...</span>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MapController grids={grids} />

        {/* Grid Cells */}
        {grids.map((grid) => {
          const bounds: [[number, number], [number, number]] = [
            [grid.bounds.bottom_left.lat, grid.bounds.bottom_left.lng],
            [grid.bounds.top_right.lat, grid.bounds.top_right.lng],
          ];

          const color = getScoreColor(grid.scores.final_score);
          const opacity = getScoreOpacity(grid.scores.final_score);

          return (
            <Rectangle
              key={grid.id}
              bounds={bounds}
              pathOptions={{
                color: color,
                weight: 1,
                fillColor: color,
                fillOpacity: opacity,
              }}
            >
              <Popup>
                <div className="text-sm space-y-1 p-2">
                  <div className="font-bold text-base mb-2">{grid.id}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600">Score:</span>
                      <span className="ml-1 font-semibold">{grid.scores.final_score.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Vehicles:</span>
                      <span className="ml-1 font-semibold">{grid.recommended_vehicles}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="text-xs space-y-1">
                      <div>Accessibility: {grid.scores.accessibility.toFixed(1)}</div>
                      <div>Demand: {grid.scores.demand.toFixed(1)}</div>
                      <div>Operational: {grid.scores.operational.toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="text-xs space-y-1">
                      <div>Metro: {grid.features.metro_distance}m</div>
                      <div>Bus Stops: {grid.features.bus_stop_count}</div>
                      <div>Buildings: {grid.features.building_count}</div>
                      <div>Traffic: {grid.features.pedestrian_traffic}</div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Rectangle>
          );
        })}

        {/* Vehicle Markers */}
        {vehicles.map((vehicle) => (
          <CircleMarker
            key={vehicle.vehicle_id}
            center={[vehicle.position.lat, vehicle.position.lng]}
            radius={8}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor: '#10b981',
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <div className="text-sm space-y-1 p-2">
                <div className="font-bold text-base mb-2">{vehicle.vehicle_id}</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-gray-600">Grid:</span>
                    <span className="ml-1 font-semibold">{vehicle.grid_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Battery:</span>
                    <span className="ml-1 font-semibold">{vehicle.battery_level}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expected Trips:</span>
                    <span className="ml-1 font-semibold">{vehicle.expected_trips}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expected Revenue:</span>
                    <span className="ml-1 font-semibold">₺{vehicle.expected_revenue}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-dark-surface border border-dark-border rounded-lg p-4 z-[1000]">
        <h3 className="text-sm font-semibold mb-3">Score Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
            <span>90-100: Excellent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span>80-89: Very Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span>70-79: Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>60-69: Fair</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>0-59: Poor</span>
          </div>
          <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-dark-border">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span>Deployed Vehicle</span>
          </div>
        </div>
      </div>
    </div>
  );
}

