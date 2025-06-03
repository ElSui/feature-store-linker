
import { GraphNode, GraphEdge } from './graphUtils';

export interface NetworkNeighborhood {
  centerNodes: Set<string>;
  connectedNodes: Set<string>;
  relevantEdges: Set<string>;
}

export class NetworkAnalyzer {
  private nodes: GraphNode[];
  private edges: GraphEdge[];

  constructor(nodes: GraphNode[], edges: GraphEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  getDirectConnections(nodeId: string): Set<string> {
    const connections = new Set<string>();
    
    this.edges.forEach(edge => {
      if (edge.source === nodeId) {
        connections.add(edge.target);
      } else if (edge.target === nodeId) {
        connections.add(edge.source);
      }
    });
    
    return connections;
  }

  getNetworkNeighborhood(centerNodeIds: string[]): NetworkNeighborhood {
    const centerNodes = new Set(centerNodeIds);
    const connectedNodes = new Set<string>();
    const relevantEdges = new Set<string>();

    // Find all directly connected nodes
    centerNodeIds.forEach(nodeId => {
      const connections = this.getDirectConnections(nodeId);
      connections.forEach(connectedId => connectedNodes.add(connectedId));
    });

    // Find all relevant edges (connecting center nodes or their connections)
    const allRelevantNodes = new Set([...centerNodes, ...connectedNodes]);
    
    this.edges.forEach(edge => {
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

  searchNetworkNeighborhood(searchTerm: string): NetworkNeighborhood {
    const matchingNodeIds: string[] = [];
    
    this.nodes.forEach(node => {
      if (node.data.label.toLowerCase().includes(searchTerm.toLowerCase())) {
        matchingNodeIds.push(node.id);
      }
    });

    return this.getNetworkNeighborhood(matchingNodeIds);
  }
}
