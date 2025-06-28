
import { Position } from '@xyflow/react';
import { calculateOptimalHandlePosition } from '../utils/handleUtils';
import { supabase } from '@/integrations/supabase/client';
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

// Custom hierarchical layout function with intelligent parent-child grouping
export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  console.log('Starting custom layout with nodes:', nodes.length, 'edges:', edges.length);

  // Step A: Define Column Positions
  const columnPositions = {
    document: 0,
    usecase: 350,
    risk: 700,
    feature: 1050
  };

  const nodeHeight = 80;
  const verticalPadding = 120;
  
  // Step B: Group nodes by type
  const nodesByType = {
    document: nodes.filter(n => n.type === 'document'),
    usecase: nodes.filter(n => n.type === 'usecase'),
    risk: nodes.filter(n => n.type === 'risk'),
    feature: nodes.filter(n => n.type === 'feature')
  };

  // Create a map for quick node lookup
  const nodeMap = new Map<string, Node>();
  nodes.forEach(node => nodeMap.set(node.id, node));

  // Create parent-child relationships map
  const childrenByParent = new Map<string, string[]>();
  const parentsByChild = new Map<string, string[]>();
  
  edges.forEach(edge => {
    // Add child to parent's children list
    if (!childrenByParent.has(edge.source)) {
      childrenByParent.set(edge.source, []);
    }
    childrenByParent.get(edge.source)!.push(edge.target);
    
    // Add parent to child's parents list
    if (!parentsByChild.has(edge.target)) {
      parentsByChild.set(edge.target, []);
    }
    parentsByChild.get(edge.target)!.push(edge.source);
  });

  const layoutedNodes: Node[] = [];

  // Step C: Position nodes column by column
  const columnOrder: (keyof typeof nodesByType)[] = ['document', 'usecase', 'risk', 'feature'];
  const columnYPositions = new Map<string, number>();

  columnOrder.forEach(columnType => {
    const nodesInColumn = nodesByType[columnType];
    const xPosition = columnPositions[columnType];
    
    console.log(`Processing column ${columnType} with ${nodesInColumn.length} nodes`);

    if (columnType === 'document') {
      // First column: simple vertical stacking
      nodesInColumn.forEach((node, index) => {
        const yPosition = index * verticalPadding;
        layoutedNodes.push({
          ...node,
          position: { x: xPosition, y: yPosition }
        });
        columnYPositions.set(node.id, yPosition);
      });
    } else {
      // Subsequent columns: position based on parent positions
      const processedNodes = new Set<string>();
      const usedYPositions = new Set<number>();

      nodesInColumn.forEach(node => {
        if (processedNodes.has(node.id)) return;

        const parents = parentsByChild.get(node.id) || [];
        let targetY = 0;

        if (parents.length > 0) {
          // Calculate average Y position of parents
          const parentYPositions = parents
            .map(parentId => columnYPositions.get(parentId))
            .filter(y => y !== undefined) as number[];
          
          if (parentYPositions.length > 0) {
            targetY = parentYPositions.reduce((sum, y) => sum + y, 0) / parentYPositions.length;
          }
        } else {
          // No parents, place at next available position
          targetY = layoutedNodes.length * verticalPadding;
        }

        // Handle collisions: ensure nodes don't overlap
        while (usedYPositions.has(targetY)) {
          targetY += verticalPadding;
        }

        // If we have siblings (nodes with the same parent), group them together
        const siblings = parents.length > 0 ? 
          parents.flatMap(parentId => childrenByParent.get(parentId) || [])
            .filter(siblingId => {
              const siblingNode = nodeMap.get(siblingId);
              return siblingNode && siblingNode.type === columnType && !processedNodes.has(siblingId);
            }) : [node.id];

        // Position this node and its siblings
        siblings.forEach((siblingId, siblingIndex) => {
          if (processedNodes.has(siblingId)) return;
          
          const siblingNode = nodeMap.get(siblingId);
          if (!siblingNode) return;

          const siblingY = targetY + (siblingIndex * verticalPadding);
          
          layoutedNodes.push({
            ...siblingNode,
            position: { x: xPosition, y: siblingY }
          });
          
          columnYPositions.set(siblingId, siblingY);
          usedYPositions.add(siblingY);
          processedNodes.add(siblingId);
          
          console.log(`Positioned ${siblingId} at (${xPosition}, ${siblingY})`);
        });
      });
    }
  });

  console.log('Layout complete. Positioned nodes:', layoutedNodes.length);
  
  return { nodes: layoutedNodes, edges };
};
