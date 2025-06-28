
import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Navigation from '@/components/Navigation';
import GraphNode from '@/components/graph/GraphNode';
import GraphSidebar from '@/components/graph/GraphSidebar';
import { getLayoutedElements } from '@/store/graphUtils';
import { NetworkAnalyzer } from '@/store/networkUtils';
import { supabase } from '@/integrations/supabase/client';
import { LoaderCircle, AlertCircle } from 'lucide-react';

const nodeTypes = {
  document: GraphNode,
  usecase: GraphNode,
  risk: GraphNode,
  feature: GraphNode,
};

const Relationships = () => {
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [allEdges, setAllEdges] = useState<Edge[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ entities: 0, connections: 0 });
  
  // Interactive states
  const [visibleTypes, setVisibleTypes] = useState({
    document: true,
    usecase: true,
    risk: true,
    feature: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());

  const networkAnalyzer = new NetworkAnalyzer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch data...');

        // Fetch all entities
        const [
          { data: documents, error: docsError },
          { data: useCases, error: useCasesError },
          { data: risks, error: risksError },
          { data: features, error: featuresError },
        ] = await Promise.all([
          supabase.from('regulatory_documents').select('*'),
          supabase.from('use_cases').select('*'),
          supabase.from('risk_indicators').select('*'),
          supabase.from('features').select('*'),
        ]);

        console.log('Fetched entities:', { documents, useCases, risks, features });

        // Check for errors
        if (docsError) throw docsError;
        if (useCasesError) throw useCasesError;
        if (risksError) throw risksError;
        if (featuresError) throw featuresError;

        // Fetch all links
        const [
          { data: docUseCaseLinks, error: docUseCaseError },
          { data: useCaseRiskLinks, error: useCaseRiskError },
          { data: riskFeatureLinks, error: riskFeatureError },
        ] = await Promise.all([
          supabase.from('document_use_case_links').select('*'),
          supabase.from('use_case_risk_links').select('*'),
          supabase.from('risk_feature_links').select('*'),
        ]);

        console.log('Fetched links:', { docUseCaseLinks, useCaseRiskLinks, riskFeatureLinks });

        // Check for link errors
        if (docUseCaseError) throw docUseCaseError;
        if (useCaseRiskError) throw useCaseRiskError;
        if (riskFeatureError) throw riskFeatureError;

        // Create nodes with null checks
        const fetchedNodes: Node[] = [
          ...(documents || []).map(d => ({ 
            id: `doc-${d.id}`, 
            type: 'document', 
            data: { 
              label: d.name, 
              entity: d,
              entityType: 'Document',
              onHighlight: handleNodeHighlight
            }, 
            position: { x: 0, y: 0 } 
          })),
          ...(useCases || []).map(u => ({ 
            id: `uc-${u.id}`, 
            type: 'usecase', 
            data: { 
              label: u.name, 
              entity: u,
              entityType: 'Use Case',
              onHighlight: handleNodeHighlight
            }, 
            position: { x: 0, y: 0 } 
          })),
          ...(risks || []).map(r => ({ 
            id: `risk-${r.id}`, 
            type: 'risk', 
            data: { 
              label: r.name, 
              entity: r,
              entityType: 'Risk Indicator',
              onHighlight: handleNodeHighlight
            }, 
            position: { x: 0, y: 0 } 
          })),
          ...(features || []).map(f => ({ 
            id: `feat-${f.id}`, 
            type: 'feature', 
            data: { 
              label: f.name, 
              entity: f,
              entityType: 'Feature',
              onHighlight: handleNodeHighlight
            }, 
            position: { x: 0, y: 0 } 
          })),
        ];

        // Create edges with improved styling
        const fetchedEdges: Edge[] = [
          ...(docUseCaseLinks || []).map(l => ({ 
            id: `e-doc${l.document_id}-uc${l.use_case_id}`, 
            source: `doc-${l.document_id}`, 
            target: `uc-${l.use_case_id}`,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#a1a1aa', strokeWidth: 2 }
          })),
          ...(useCaseRiskLinks || []).map(l => ({ 
            id: `e-uc${l.use_case_id}-risk${l.risk_indicator_id}`, 
            source: `uc-${l.use_case_id}`, 
            target: `risk-${l.risk_indicator_id}`,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#a1a1aa', strokeWidth: 2 }
          })),
          ...(riskFeatureLinks || []).map(l => ({ 
            id: `e-risk${l.risk_indicator_id}-feat${l.feature_id}`, 
            source: `risk-${l.risk_indicator_id}`, 
            target: `feat-${l.feature_id}`,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#a1a1aa', strokeWidth: 2 }
          })),
        ];

        console.log('Created nodes and edges:', { nodeCount: fetchedNodes.length, edgeCount: fetchedEdges.length });
        
        setAllNodes(fetchedNodes);
        setAllEdges(fetchedEdges);
        setStats({ entities: fetchedNodes.length, connections: fetchedEdges.length });

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch graph data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update visible nodes and edges based on filters and search
  useEffect(() => {
    let filteredNodes = allNodes.filter(node => 
      visibleTypes[node.type as keyof typeof visibleTypes]
    );

    let filteredEdges = allEdges.filter(edge => {
      const sourceNode = allNodes.find(n => n.id === edge.source);
      const targetNode = allNodes.find(n => n.id === edge.target);
      return sourceNode && targetNode && 
             visibleTypes[sourceNode.type as keyof typeof visibleTypes] &&
             visibleTypes[targetNode.type as keyof typeof visibleTypes];
    });

    // Apply search highlighting
    if (searchTerm) {
      const searchResults = networkAnalyzer.findRelatedNodes(allNodes, allEdges, searchTerm);
      setHighlightedNodes(new Set(searchResults.map(node => node.id)));
      
      // Update node data with highlight/dim state
      filteredNodes = filteredNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: searchResults.some(r => r.id === node.id),
          isDimmed: !searchResults.some(r => r.id === node.id) && searchResults.length > 0
        }
      }));
    } else {
      setHighlightedNodes(new Set());
      // Reset highlight states
      filteredNodes = filteredNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: false,
          isDimmed: false
        }
      }));
    }

    // Calculate layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(filteredNodes, filteredEdges);
    
    console.log('Applied layout:', { layoutedNodes: layoutedNodes.length, layoutedEdges: layoutedEdges.length });
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [allNodes, allEdges, visibleTypes, searchTerm, networkAnalyzer]);

  const handleTypeToggle = useCallback((type: keyof typeof visibleTypes) => {
    setVisibleTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleNodeHighlight = useCallback((nodeId: string) => {
    const relatedNodes = networkAnalyzer.findConnectedNodes(allNodes, allEdges, nodeId);
    setHighlightedNodes(new Set(relatedNodes.map(node => node.id)));
    setSearchTerm(''); // Clear search when manually highlighting
  }, [allNodes, allEdges, networkAnalyzer]);

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
      <div className="flex-grow relative" style={{ height: 'calc(100vh - 64px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
          style={{ width: '100%', height: '100%' }}
        >
          <Controls />
          <Background color="#e5e7eb" gap={20} />
          <GraphSidebar
            stats={stats}
            visibleTypes={visibleTypes}
            onTypeToggle={handleTypeToggle}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Relationships;
