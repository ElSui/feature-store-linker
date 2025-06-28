
import React, { useState, useEffect } from 'react';
import { ReactFlow, Controls, Background, Panel, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Navigation from '@/components/Navigation';
import GraphNode from '@/components/graph/GraphNode';
import { getLayoutedElements } from '@/store/graphUtils';
import { supabase } from '@/integrations/supabase/client';
import { LoaderCircle, AlertCircle } from 'lucide-react';

const nodeTypes = {
  document: GraphNode,
  usecase: GraphNode,
  risk: GraphNode,
  feature: GraphNode,
};

const Relationships = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ entities: 0, connections: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all entities
        const [
          { data: documents },
          { data: useCases },
          { data: risks },
          { data: features },
        ] = await Promise.all([
          supabase.from('regulatory_documents').select('*'),
          supabase.from('use_cases').select('*'),
          supabase.from('risk_indicators').select('*'),
          supabase.from('features').select('*'),
        ]);

        // Fetch all links
        const [
          { data: docUseCaseLinks },
          { data: useCaseRiskLinks },
          { data: riskFeatureLinks },
        ] = await Promise.all([
          supabase.from('document_use_case_links').select('*'),
          supabase.from('use_case_risk_links').select('*'),
          supabase.from('risk_feature_links').select('*'),
        ]);

        // Create nodes with null checks
        const allNodes: Node[] = [
          ...(documents || []).map(d => ({ 
            id: `doc-${d.id}`, 
            type: 'document', 
            data: { 
              label: d.name, 
              entity: d,
              entityType: 'Document' 
            }, 
            position: { x: 0, y: 0 } 
          })),
          ...(useCases || []).map(u => ({ 
            id: `uc-${u.id}`, 
            type: 'usecase', 
            data: { 
              label: u.name, 
              entity: u,
              entityType: 'Use Case' 
            }, 
            position: { x: 0, y: 0 } 
          })),
          ...(risks || []).map(r => ({ 
            id: `risk-${r.id}`, 
            type: 'risk', 
            data: { 
              label: r.name, 
              entity: r,
              entityType: 'Risk Indicator' 
            }, 
            position: { x: 0, y: 0 } 
          })),
          ...(features || []).map(f => ({ 
            id: `feat-${f.id}`, 
            type: 'feature', 
            data: { 
              label: f.name, 
              entity: f,
              entityType: 'Feature' 
            }, 
            position: { x: 0, y: 0 } 
          })),
        ];

        // Create edges with null checks
        const allEdges: Edge[] = [
          ...(docUseCaseLinks || []).map(l => ({ 
            id: `e-doc${l.document_id}-uc${l.use_case_id}`, 
            source: `doc-${l.document_id}`, 
            target: `uc-${l.use_case_id}`,
            type: 'smoothstep',
            animated: true
          })),
          ...(useCaseRiskLinks || []).map(l => ({ 
            id: `e-uc${l.use_case_id}-risk${l.risk_indicator_id}`, 
            source: `uc-${l.use_case_id}`, 
            target: `risk-${l.risk_indicator_id}`,
            type: 'smoothstep',
            animated: true
          })),
          ...(riskFeatureLinks || []).map(l => ({ 
            id: `e-risk${l.risk_indicator_id}-feat${l.feature_id}`, 
            source: `risk-${l.risk_indicator_id}`, 
            target: `feat-${l.feature_id}`,
            type: 'smoothstep',
            animated: true
          })),
        ];
        
        // Calculate layout using Dagre
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(allNodes, allEdges);
        
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setStats({ entities: allNodes.length, connections: allEdges.length });

      } catch (err) {
        setError('Failed to fetch graph data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-gray-600">Building Knowledge Graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="ml-4 text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex-grow relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <Background color="#e5e7eb" gap={20} />
          <Panel position="top-left" className="p-4 bg-white rounded-lg shadow-md border">
            <h3 className="font-bold text-lg mb-2">Knowledge Graph</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Entities:</span> {stats.entities}</p>
              <p><span className="font-medium">Connections:</span> {stats.connections}</p>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default Relationships;
