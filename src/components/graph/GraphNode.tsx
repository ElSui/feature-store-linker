
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Target, AlertTriangle, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GraphNodeProps {
  data: {
    label: string;
    entity: any;
    entityType: string;
  };
  type: 'document' | 'usecase' | 'risk' | 'feature';
}

const GraphNode = memo(({ data, type }: GraphNodeProps) => {
  const getNodeStyle = () => {
    const baseStyle = "p-3 rounded-lg border-2 shadow-lg min-w-[120px] text-center text-sm font-medium cursor-pointer transition-all duration-200 hover:shadow-xl";
    
    switch (type) {
      case 'document':
        return cn(baseStyle, "bg-blue-50 border-blue-500 text-blue-900 hover:bg-blue-100");
      case 'usecase':
        return cn(baseStyle, "bg-emerald-50 border-emerald-500 text-emerald-900 hover:bg-emerald-100");
      case 'risk':
        return cn(baseStyle, "bg-amber-50 border-amber-500 text-amber-900 hover:bg-amber-100");
      case 'feature':
        return cn(baseStyle, "bg-purple-50 border-purple-500 text-purple-900 hover:bg-purple-100");
      default:
        return cn(baseStyle, "bg-gray-50 border-gray-500 text-gray-900");
    }
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

  return (
    <div className={getNodeStyle()}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      <Handle type="target" position={Position.Left} className="w-2 h-2" />
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
      
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
