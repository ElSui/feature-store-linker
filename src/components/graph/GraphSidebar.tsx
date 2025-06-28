
import React from 'react';
import { Panel } from '@xyflow/react';
import { Search, Filter } from 'lucide-react';

interface GraphSidebarProps {
  stats: { entities: number; connections: number };
  visibleTypes: {
    document: boolean;
    usecase: boolean;
    risk: boolean;
    feature: boolean;
  };
  onTypeToggle: (type: keyof typeof visibleTypes) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const GraphSidebar = ({
  stats,
  visibleTypes,
  onTypeToggle,
  searchTerm,
  onSearchChange,
}: GraphSidebarProps) => {
  const entityTypes = [
    { key: 'document' as const, label: 'Documents', color: 'text-blue-600' },
    { key: 'usecase' as const, label: 'Use Cases', color: 'text-emerald-600' },
    { key: 'risk' as const, label: 'Risk Indicators', color: 'text-amber-600' },
    { key: 'feature' as const, label: 'Features', color: 'text-purple-600' },
  ];

  return (
    <Panel position="top-left" className="w-80">
      <div className="bg-white rounded-lg shadow-lg border p-4 space-y-4">
        {/* Header */}
        <div>
          <h3 className="font-bold text-lg mb-2">Knowledge Graph</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Entities:</span> {stats.entities}</p>
            <p><span className="font-medium">Connections:</span> {stats.connections}</p>
          </div>
        </div>

        {/* Search */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-sm">Search</span>
          </div>
          <input
            type="text"
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-sm">Filter by Type</span>
          </div>
          <div className="space-y-2">
            {entityTypes.map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleTypes[key]}
                  onChange={() => onTypeToggle(key)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm font-medium ${color}`}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default GraphSidebar;
