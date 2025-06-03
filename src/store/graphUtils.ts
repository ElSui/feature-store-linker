import { dataStore, RegulatoryDocument, UseCase, RiskIndicator, Feature } from './dataStore';

export interface GraphNode {
  id: string;
  type: 'document' | 'usecase' | 'risk' | 'feature';
  position: { x: number; y: number };
  data: {
    label: string;
    entity: RegulatoryDocument | UseCase | RiskIndicator | Feature;
    entityType: string;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
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
    const radius = 300;
    const centerX = 400;
    const centerY = 400;
    
    // Position different entity types in different areas
    const typeOffsets = {
      document: { x: -200, y: -200 },
      usecase: { x: 200, y: -200 },
      risk: { x: 200, y: 200 },
      feature: { x: -200, y: 200 }
    };
    
    const offset = typeOffsets[entityType as keyof typeof typeOffsets] || { x: 0, y: 0 };
    const angle = (index / total) * 2 * Math.PI;
    
    return {
      x: centerX + offset.x + Math.cos(angle) * radius,
      y: centerY + offset.y + Math.sin(angle) * radius
    };
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
