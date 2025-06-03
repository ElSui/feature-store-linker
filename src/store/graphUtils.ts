import { dataStore, RegulatoryDocument, UseCase, RiskIndicator, Feature } from './dataStore';
import { Position } from '@xyflow/react';
import { calculateOptimalHandlePosition } from '../utils/handleUtils';

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

  getGraphData(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Get all entities
    const documents = dataStore.getDocuments();
    const useCases = dataStore.getUseCases();
    const riskIndicators = dataStore.getRiskIndicators();
    const features = dataStore.getFeatures();

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

    // Create edges for document-usecase relationships
    documents.forEach(doc => {
      const linkedUseCases = dataStore.getLinkedUseCasesForDocument(doc.id);
      linkedUseCases.forEach(uc => {
        edges.push({
          id: `doc-${doc.id}-uc-${uc.id}`,
          source: `doc-${doc.id}`,
          target: `uc-${uc.id}`,
          type: 'default'
        });
      });
    });

    // Create edges for usecase-risk relationships
    useCases.forEach(uc => {
      const linkedRisks = dataStore.getLinkedRiskIndicatorsForUseCase(uc.id);
      linkedRisks.forEach(risk => {
        edges.push({
          id: `uc-${uc.id}-risk-${risk.id}`,
          source: `uc-${uc.id}`,
          target: `risk-${risk.id}`,
          type: 'default'
        });
      });
    });

    // Create edges for risk-feature relationships
    riskIndicators.forEach(risk => {
      const linkedFeatures = dataStore.getLinkedFeaturesForRiskIndicator(risk.id);
      linkedFeatures.forEach(feature => {
        edges.push({
          id: `risk-${risk.id}-feature-${feature.id}`,
          source: `risk-${risk.id}`,
          target: `feature-${feature.id}`,
          type: 'default'
        });
      });
    });

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
  }

  getConnectionStats() {
    const documents = dataStore.getDocuments();
    const useCases = dataStore.getUseCases();
    const riskIndicators = dataStore.getRiskIndicators();
    const features = dataStore.getFeatures();

    const totalConnections = 
      documents.reduce((acc, doc) => acc + dataStore.getLinkedUseCasesForDocument(doc.id).length, 0) +
      useCases.reduce((acc, uc) => acc + dataStore.getLinkedRiskIndicatorsForUseCase(uc.id).length, 0) +
      riskIndicators.reduce((acc, risk) => acc + dataStore.getLinkedFeaturesForRiskIndicator(risk.id).length, 0);

    return {
      totalEntities: documents.length + useCases.length + riskIndicators.length + features.length,
      totalConnections,
      entityCounts: {
        documents: documents.length,
        useCases: useCases.length,
        riskIndicators: riskIndicators.length,
        features: features.length
      }
    };
  }
}

export const graphTransformer = new GraphDataTransformer();
