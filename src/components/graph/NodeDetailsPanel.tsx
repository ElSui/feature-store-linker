
import React from 'react';
import { Panel } from '@xyflow/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, FileText, Target, AlertTriangle, Cpu } from 'lucide-react';
import { Node } from '@xyflow/react';

interface NodeData {
  label: string;
  entity: {
    id: string;
    [key: string]: any;
  };
  entityType: string;
  [key: string]: any;
}

interface NodeDetailsPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({ selectedNode, onClose }) => {
  const navigate = useNavigate();

  if (!selectedNode) return null;

  // Type guard to ensure we have the expected data structure
  const nodeData = selectedNode.data as NodeData;
  if (!nodeData || !nodeData.entity || !nodeData.entity.id) {
    return null;
  }

  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (selectedNode.type) {
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

  const getDetailPagePath = () => {
    const entityId = nodeData.entity.id;
    switch (selectedNode.type) {
      case 'document':
        return `/documents/${entityId}`;
      case 'usecase':
        return `/use-cases/${entityId}`;
      case 'risk':
        return `/risk-indicators/${entityId}`;
      case 'feature':
        return `/features/${entityId}`;
      default:
        return '/';
    }
  };

  const handleViewDetails = () => {
    const path = getDetailPagePath();
    navigate(path);
  };

  return (
    <Panel position="bottom-center" className="m-4">
      <Card className="w-80 shadow-lg border-2 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIcon()}
              <CardTitle className="text-sm font-medium text-gray-600">
                {nodeData.entityType}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm leading-tight">
            {nodeData.label}
          </h3>
          <Button 
            onClick={handleViewDetails}
            className="w-full"
            size="sm"
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </Panel>
  );
};

export default NodeDetailsPanel;
