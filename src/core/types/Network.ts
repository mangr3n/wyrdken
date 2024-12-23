export interface Node {
    id: string;
    name: string;
    states: string[];
    parents: string[];  // Array of parent node IDs
    cpt: Map<string, number>;  // Conditional probability table
}

export interface Network {
    id: string;
    name: string;
    nodes: Map<string, Node>;
    
    // Basic network operations
    addNode(node: Node): void;
    getNode(id: string): Node | undefined;
    hasNode(id: string): boolean;
    
    // Network validation
    isValid(): boolean;
    
    // Network information
    getNodeCount(): number;
    getEdgeCount(): number;
}
