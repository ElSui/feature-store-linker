
import { Node, Edge } from '@xyflow/react';

export interface NetworkNeighborhood {
  centerNodes: Set<string>;
  connectedNodes: Set<string>;
  relevantEdges: Set<string>;
}

export class NetworkAnalyzer {
  constructor() {
    // Constructor now takes no arguments - data will be passed to methods
  }

  getDirectConnections(nodeId: string, edges: Edge[]): Set<string> {
    const connections = new Set<string>();
    
    edges.forEach(edge => {
      if (edge.source === nodeId) {
        connections.add(edge.target);
      } else if (edge.target === nodeId) {
        connections.add(edge.source);
      }
    });
    
    return connections;
  }

  getNetworkNeighborhood(centerNodeIds: string[], nodes: Node[], edges: Edge[]): NetworkNeighborhood {
    const centerNodes = new Set(centerNodeIds);
    const connectedNodes = new Set<string>();
    const relevantEdges = new Set<string>();

    // Find all directly connected nodes
    centerNodeIds.forEach(nodeId => {
      const connections = this.getDirectConnections(nodeId, edges);
      connections.forEach(connectedId => connectedNodes.add(connectedId));
    });

    // Find all relevant edges (connecting center nodes or their connections)
    const allRelevantNodes = new Set([...centerNodes, ...connectedNodes]);
    
    edges.forEach(edge => {
      if (allRelevantNodes.has(edge.source) && allRelevantNodes.has(edge.target)) {
        relevantEdges.add(edge.id);
      }
    });

    return {
      centerNodes,
      connectedNodes,
      relevantEdges
    };
  }

  findRelatedNodes(nodes: Node[], edges: Edge[], searchTerm: string): Node[] {
    const matchingNodes = nodes.filter(node => 
      node.data.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingNodes.length === 0) return [];

    const matchingNodeIds = matchingNodes.map(node => node.id);
    const neighborhood = this.getNetworkNeighborhood(matchingNodeIds, nodes, edges);
    
    const allRelevantNodeIds = new Set([
      ...neighborhood.centerNodes,
      ...neighborhood.connectedNodes
    ]);

    return nodes.filter(node => allRelevantNodeIds.has(node.id));
  }

  findConnectedNodes(nodes: Node[], edges: Edge[], nodeId: string): Node[] {
    const neighborhood = this.getNetworkNeighborhood([nodeId], nodes, edges);
    
    const allConnectedNodeIds = new Set([
      ...neighborhood.centerNodes,
      ...neighborhood.connectedNodes
    ]);

    return nodes.filter(node => allConnectedNodeIds.has(node.id));
  }

  searchNetworkNeighborhood(nodes: Node[], edges: Edge[], searchTerm: string): NetworkNeighborhood {
    const matchingNodeIds: string[] = [];
    
    nodes.forEach(node => {
      if (node.data.label.toLowerCase().includes(searchTerm.toLowerCase())) {
        matchingNodeIds.push(node.id);
      }
    });

    return this.getNetworkNeighborhood(matchingNodeIds, nodes, edges);
  }
}
