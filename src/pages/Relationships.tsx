
import React, { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Navigation from '@/components/Navigation';
import GraphNode from '@/components/graph/GraphNode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { graphTransformer } from '@/store/graphUtils';
import { Search, Filter, ZoomIn, RotateCcw } from 'lucide-react';

const nodeTypes = {
  document: GraphNode,
  usecase: GraphNode,
  risk: GraphNode,
  feature: GraphNode,
};

const Relationships = () => {
  const navigate = useNavigate();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleTypes, setVisibleTypes] = useState({
    document: true,
    usecase: true,
    risk: true,
    feature: true
  });

  // Get graph data
  const graphData = useMemo(() => graphTransformer.getGraphData(), []);
  const stats = useMemo(() => graphTransformer.getConnectionStats(), []);

  // Filter nodes based on search and visibility
  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter(node => {
      const typeVisible = visibleTypes[node.type as keyof typeof visibleTypes];
      const matchesSearch = searchTerm === '' || 
        node.data.label.toLowerCase().includes(searchTerm.toLowerCase());
      return typeVisible && matchesSearch;
    });
  }, [graphData.nodes, visibleTypes, searchTerm]);

  // Filter edges to only show connections between visible nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    return graphData.edges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [graphData.edges, filteredNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(filteredNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(filteredEdges);

  // Update nodes and edges when filters change
  React.useEffect(() => {
    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [filteredNodes, filteredEdges, setNodes, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    
    // Navigate to the entity's detail page
    const entityId = node.data.entity.id;
    const type = node.type;
    
    switch (type) {
      case 'document':
        navigate(`/documents/${entityId}`);
        break;
      case 'usecase':
        navigate(`/use-cases/${entityId}`);
        break;
      case 'risk':
        navigate(`/risk-indicators/${entityId}`);
        break;
      case 'feature':
        navigate(`/features/${entityId}`);
        break;
    }
  }, [navigate]);

  const handleTypeToggle = (type: keyof typeof visibleTypes) => {
    setVisibleTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const resetView = () => {
    setSearchTerm('');
    setVisibleTypes({
      document: true,
      usecase: true,
      risk: true,
      feature: true
    });
    setSelectedNodeId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Network Overview</CardTitle>
                <CardDescription>Visualize relationships between compliance entities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Entities: <span className="font-medium">{stats.totalEntities}</span></div>
                  <div>Connections: <span className="font-medium">{stats.totalConnections}</span></div>
                  <div>Documents: <span className="font-medium">{stats.entityCounts.documents}</span></div>
                  <div>Use Cases: <span className="font-medium">{stats.entityCounts.useCases}</span></div>
                  <div>Risk Indicators: <span className="font-medium">{stats.entityCounts.riskIndicators}</span></div>
                  <div>Features: <span className="font-medium">{stats.entityCounts.features}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Entities</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Entity Types
              </label>
              <div className="space-y-2">
                {[
                  { key: 'document', label: 'Documents', color: 'bg-blue-500' },
                  { key: 'usecase', label: 'Use Cases', color: 'bg-emerald-500' },
                  { key: 'risk', label: 'Risk Indicators', color: 'bg-amber-500' },
                  { key: 'feature', label: 'Features', color: 'bg-purple-500' }
                ].map(({ key, label, color }) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleTypes[key as keyof typeof visibleTypes]}
                      onChange={() => handleTypeToggle(key as keyof typeof visibleTypes)}
                      className="rounded"
                    />
                    <div className={`w-3 h-3 rounded ${color}`}></div>
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button variant="outline" onClick={resetView} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
          </div>
        </div>

        {/* Graph Area */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            className="bg-gray-50"
            minZoom={0.1}
            maxZoom={2}
          >
            <Controls />
            <Background color="#e5e7eb" gap={20} />
            
            <Panel position="top-right" className="bg-white p-2 rounded shadow">
              <div className="text-xs text-gray-600">
                Click on nodes to view details
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default Relationships;
