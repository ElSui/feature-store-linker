
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Target, AlertTriangle, Cpu, Focus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GraphNodeProps {
  data: {
    label: string;
    entity: any;
    entityType: string;
    onHighlight?: (nodeId: string) => void;
    isHighlighted?: boolean;
    isDimmed?: boolean;
    dynamicHandles?: Array<{
      id: string;
      type: 'source' | 'target';
      position: Position;
      style?: React.CSSProperties;
    }>;
  };
  type: 'document' | 'usecase' | 'risk' | 'feature';
  id: string;
}

const GraphNode = memo(({ data, type, id }: GraphNodeProps) => {
  const getNodeStyle = () => {
    const baseStyle = "p-3 rounded-lg border-2 shadow-lg min-w-[150px] max-w-[250px] text-center text-sm font-medium cursor-pointer transition-all duration-200 hover:shadow-xl relative";
    
    let colorClasses = "";
    switch (type) {
      case 'document':
        colorClasses = "bg-blue-50 border-blue-500 text-blue-900 hover:bg-blue-100";
        break;
      case 'usecase':
        colorClasses = "bg-emerald-50 border-emerald-500 text-emerald-900 hover:bg-emerald-100";
        break;
      case 'risk':
        colorClasses = "bg-amber-50 border-amber-500 text-amber-900 hover:bg-amber-100";
        break;
      case 'feature':
        colorClasses = "bg-purple-50 border-purple-500 text-purple-900 hover:bg-purple-100";
        break;
      default:
        colorClasses = "bg-gray-50 border-gray-500 text-gray-900";
    }

    // Apply visual states
    if (data.isHighlighted) {
      colorClasses += " ring-4 ring-blue-400 ring-opacity-60 scale-105 z-10";
    } else if (data.isDimmed) {
      colorClasses += " opacity-30";
    }
    
    return cn(baseStyle, colorClasses);
  };

  const getIcon = () => {
    const iconClass = "w-4 h-4 mb-1 mx-auto";
    switch (type) {
      case 'document':
        return <FileText className={iconClass} />;
      case 'usecase':
        return <Target className={iconClass} />;
      case 'risk':
        return <AlertTriangle className={iconClass} />;
      case 'feature':
        return <Cpu className={iconClass} />;
      default:
        return null;
    }
  };

  const handleHighlight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onHighlight) {
      data.onHighlight(id);
    }
  };

  return (
    <div className={getNodeStyle()}>
      {/* Left-to-right handles only */}
      <Handle type="target" position={Position.Left} className="w-2 h-2" />
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
      
      {/* Highlight button */}
      <button
        onClick={handleHighlight}
        className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center"
        title="Highlight network"
      >
        <Focus className="w-3 h-3" />
      </button>
      
      <div className="flex flex-col items-center">
        {getIcon()}
        <div className="font-semibold text-xs mb-1">{data.entityType}</div>
        <div className="break-words">{data.label}</div>
      </div>
    </div>
  );
});

GraphNode.displayName = 'GraphNode';

export default GraphNode;
