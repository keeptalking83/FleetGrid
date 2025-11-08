import { ReactNode } from 'react';
import clsx from 'clsx';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  change: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'pink';
}

const colorClasses = {
  blue: 'bg-blue-500/10 text-blue-400',
  green: 'bg-green-500/10 text-green-400',
  purple: 'bg-purple-500/10 text-purple-400',
  yellow: 'bg-yellow-500/10 text-yellow-400',
  pink: 'bg-pink-500/10 text-pink-400',
};

export default function StatsCard({ icon, label, value, change, color }: StatsCardProps) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className={clsx('p-2 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{change}</p>
      </div>
    </div>
  );
}

