import { Position } from '@xyflow/react';
import { calculateOptimalHandlePosition } from '../utils/handleUtils';
import { supabase } from '@/integrations/supabase/client';
import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';

// Define types based on our Supabase schema
export interface RegulatoryDocument {
  id: string;
  name: string;
  publisher: string;
  region: string;
  publication_date: string;
}

export interface UseCase {
  id: string;
  name: string;
  description: string | null;
  business_area: string | null;
}

export interface RiskIndicator {
  id: string;
  unique_risk_id: string;
  name: string;
  description: string | null;
  category: string | null;
  aml_typology: string | null;
  predicate_offence: string | null;
}

export interface Feature {
  id: string;
  unique_feature_id: string;
  name: string;
  description: string;
  logic_summary: string;
  type: string;
  category: string;
  lookback_period: string;
  is_pc: boolean;
  is_rb: boolean;
}

export interface GraphNode {
  id: string;
  type: 'document' | 'usecase' | 'risk' | 'feature';
  position: { x: number; y: number };
  data: {
    label: string;
    entity: RegulatoryDocument | UseCase | RiskIndicator | Feature;
    entityType: string;
    dynamicHandles?: Array<{
      id: string;
      type: 'source' | 'target';
      position: Position;
      style?: React.CSSProperties;
    }>;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: 'default';
  animated?: boolean;
  style?: {
    opacity?: number;
    strokeWidth?: number;
    [key: string]: any;
  };
}

export class GraphDataTransformer {
  private getNodePosition(index: number, total: number, entityType: string): { x: number; y: number } {
    const centerX = 600;
    const centerY = 400;
    
    // Define hierarchical layers with different radii
    const layerConfig = {
      document: { radius: 100, layer: 1 }, // Inner circle - Documents
      usecase: { radius: 250, layer: 2 },  // Second circle - Use Cases
      risk: { radius: 400, layer: 3 },     // Third circle - Risk Indicators
      feature: { radius: 550, layer: 4 }   // Outer circle - Features
    };
    
    const config = layerConfig[entityType as keyof typeof layerConfig] || { radius: 300, layer: 1 };
    
    // Calculate angle for even distribution around the circle
    const angle = (index / total) * 2 * Math.PI;
    
    // Add some offset to avoid perfect alignment
    const angleOffset = (config.layer - 1) * 0.2; // Slight rotation per layer
    
    return {
      x: centerX + Math.cos(angle + angleOffset) * config.radius,
      y: centerY + Math.sin(angle + angleOffset) * config.radius
    };
  }

  private calculateDynamicHandles(nodes: GraphNode[], edges: GraphEdge[]) {
    const nodePositions = new Map<string, { x: number; y: number }>();
    nodes.forEach(node => {
      nodePositions.set(node.id, node.position);
    });

    const nodeHandles = new Map<string, Array<{
      id: string;
      type: 'source' | 'target';
      position: Position;
      style?: React.CSSProperties;
    }>>();

    // Initialize handles array for each node
    nodes.forEach(node => {
      nodeHandles.set(node.id, []);
    });

    // Calculate handles for each edge
    edges.forEach(edge => {
      const sourcePos = nodePositions.get(edge.source);
      const targetPos = nodePositions.get(edge.target);
      
      if (sourcePos && targetPos) {
        // Calculate source handle
        const sourceHandle = calculateOptimalHandlePosition(sourcePos, targetPos, true);
        const sourceHandleData = {
          id: `${edge.id}-source`,
          type: 'source' as const,
          position: this.getReactFlowPosition(sourceHandle.position),
          style: sourceHandle.style
        };

        // Calculate target handle
        const targetHandle = calculateOptimalHandlePosition(targetPos, sourcePos, false);
        const targetHandleData = {
          id: `${edge.id}-target`,
          type: 'target' as const,
          position: this.getReactFlowPosition(targetHandle.position),
          style: targetHandle.style
        };

        // Add handles to respective nodes
        const sourceHandles = nodeHandles.get(edge.source) || [];
        const targetHandles = nodeHandles.get(edge.target) || [];
        
        sourceHandles.push(sourceHandleData);
        targetHandles.push(targetHandleData);
        
        nodeHandles.set(edge.source, sourceHandles);
        nodeHandles.set(edge.target, targetHandles);

        // Update edge with specific handle IDs
        edge.sourceHandle = sourceHandleData.id;
        edge.targetHandle = targetHandleData.id;
      }
    });

    return nodeHandles;
  }

  private getReactFlowPosition(position: string): Position {
    switch (position) {
      case 'top':
      case 'top-left':
      case 'top-right':
        return Position.Top;
      case 'bottom':
      case 'bottom-left':
      case 'bottom-right':
        return Position.Bottom;
      case 'left':
        return Position.Left;
      case 'right':
        return Position.Right;
      default:
        return Position.Top;
    }
  }

  async getGraphData(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    try {
      // Fetch all entities from Supabase
      const [documentsResult, useCasesResult, riskIndicatorsResult, featuresResult] = await Promise.all([
        supabase.from('regulatory_documents').select('*'),
        supabase.from('use_cases').select('*'),
        supabase.from('risk_indicators').select('*'),
        supabase.from('features').select('*')
      ]);

      const documents = documentsResult.data || [];
      const useCases = useCasesResult.data || [];
      const riskIndicators = riskIndicatorsResult.data || [];
      const features = featuresResult.data || [];

      // Create nodes for documents
      documents.forEach((doc, index) => {
        nodes.push({
          id: `doc-${doc.id}`,
          type: 'document',
          position: this.getNodePosition(index, documents.length, 'document'),
          data: {
            label: doc.name,
            entity: doc,
            entityType: 'Document'
          }
        });
      });

      // Create nodes for use cases
      useCases.forEach((uc, index) => {
        nodes.push({
          id: `uc-${uc.id}`,
          type: 'usecase',
          position: this.getNodePosition(index, useCases.length, 'usecase'),
          data: {
            label: uc.name,
            entity: uc,
            entityType: 'Use Case'
          }
        });
      });

      // Create nodes for risk indicators
      riskIndicators.forEach((ri, index) => {
        nodes.push({
          id: `risk-${ri.id}`,
          type: 'risk',
          position: this.getNodePosition(index, riskIndicators.length, 'risk'),
          data: {
            label: ri.name,
            entity: ri,
            entityType: 'Risk Indicator'
          }
        });
      });

      // Create nodes for features
      features.forEach((feature, index) => {
        nodes.push({
          id: `feature-${feature.id}`,
          type: 'feature',
          position: this.getNodePosition(index, features.length, 'feature'),
          data: {
            label: feature.name,
            entity: feature,
            entityType: 'Feature'
          }
        });
      });

      // For now, we'll create a simple graph without relationship links
      // TODO: Implement relationship fetching when link tables are set up
      
      // Calculate dynamic handles
      const nodeHandles = this.calculateDynamicHandles(nodes, edges);

      // Add dynamic handles to node data
      nodes.forEach(node => {
        const handles = nodeHandles.get(node.id);
        if (handles && handles.length > 0) {
          node.data.dynamicHandles = handles;
        }
      });

      return { nodes, edges };
    } catch (error) {
      console.error('Error fetching graph data:', error);
      return { nodes: [], edges: [] };
    }
  }

  async getConnectionStats() {
    try {
      const [documentsResult, useCasesResult, riskIndicatorsResult, featuresResult] = await Promise.all([
        supabase.from('regulatory_documents').select('id', { count: 'exact', head: true }),
        supabase.from('use_cases').select('id', { count: 'exact', head: true }),
        supabase.from('risk_indicators').select('id', { count: 'exact', head: true }),
        supabase.from('features').select('id', { count: 'exact', head: true })
      ]);

      const documentCount = documentsResult.count || 0;
      const useCaseCount = useCasesResult.count || 0;
      const riskIndicatorCount = riskIndicatorsResult.count || 0;
      const featureCount = featuresResult.count || 0;

      return {
        totalEntities: documentCount + useCaseCount + riskIndicatorCount + featureCount,
        totalConnections: 0, // TODO: Calculate when relationship tables are implemented
        entityCounts: {
          documents: documentCount,
          useCases: useCaseCount,
          riskIndicators: riskIndicatorCount,
          features: featureCount
        }
      };
    } catch (error) {
      console.error('Error fetching connection stats:', error);
      return {
        totalEntities: 0,
        totalConnections: 0,
        entityCounts: {
          documents: 0,
          useCases: 0,
          riskIndicators: 0,
          features: 0
        }
      };
    }
  }
}

export const graphTransformer = new GraphDataTransformer();

// Intelligent hierarchical layout function with invisible anchor nodes for strict columnar positioning
export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 50, ranksep: 180 });
  g.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 150;
  const nodeHeight = 60;

  // Step 1: Create invisible rank anchor nodes to define columns
  const anchorNodes = ['RANK_0', 'RANK_1', 'RANK_2', 'RANK_3'];
  anchorNodes.forEach(anchorId => {
    g.setNode(anchorId, { 
      width: 1, 
      height: 1,
      rank: parseInt(anchorId.split('_')[1]) // Extract rank number
    });
  });

  // Step 2: Create the graph "spine" - invisible edges connecting anchor nodes
  for (let i = 0; i < anchorNodes.length - 1; i++) {
    g.setEdge(anchorNodes[i], anchorNodes[i + 1]);
  }

  // Step 3: Add all real nodes and assign them to their correct columns
  nodes.forEach((node) => {
    let rank = 0;
    let anchorNode = 'RANK_0';
    
    // Determine rank and anchor based on node type
    if (node.type === 'document') {
      rank = 0;
      anchorNode = 'RANK_0';
    } else if (node.type === 'usecase') {
      rank = 1;
      anchorNode = 'RANK_1';
    } else if (node.type === 'risk') {
      rank = 2;
      anchorNode = 'RANK_2';
    } else if (node.type === 'feature') {
      rank = 3;
      anchorNode = 'RANK_3';
    }
    
    g.setNode(node.id, { 
      width: nodeWidth, 
      height: nodeHeight,
      rank: rank 
    });

    // Create invisible edge from anchor node to this node to enforce column placement
    g.setEdge(anchorNode, node.id);
  });

  // Step 4: Group children by parent and create invisible constraint edges
  const childrenByParent = new Map<string, string[]>();
  
  // Group child node IDs by their parent node ID
  edges.forEach(edge => {
    if (!childrenByParent.has(edge.source)) {
      childrenByParent.set(edge.source, []);
    }
    childrenByParent.get(edge.source)!.push(edge.target);
  });

  // Create invisible constraint edges between siblings
  const allEdgesWithConstraints = [...edges];
  childrenByParent.forEach((siblings) => {
    if (siblings.length > 1) {
      // Create invisible edges connecting siblings to keep them grouped
      for (let i = 0; i < siblings.length - 1; i++) {
        const invisibleEdge: Edge = {
          id: `invisible-${siblings[i]}-${siblings[i + 1]}`,
          source: siblings[i],
          target: siblings[i + 1],
          type: 'bezier',
          style: { opacity: 0 },
          animated: false
        };
        allEdgesWithConstraints.push(invisibleEdge);
      }
    }
  });

  // Add all edges (including invisible constraint edges) to dagre
  allEdgesWithConstraints.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Run the layout algorithm
  dagre.layout(g);

  // Step 5: Extract only the real nodes with their calculated positions
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      }
    };
  });

  // Update edge types to bezier for better aesthetics and return only real edges
  const layoutedEdges = edges.map(edge => ({
    ...edge,
    type: 'bezier' as const
  }));

  // Return only the real elements (exclude invisible anchor nodes and constraint edges)
  return { nodes: layoutedNodes, edges: layoutedEdges };
};
