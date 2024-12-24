export interface Node {
    id: string;
    name: string;
    states: string[];    // Must have at least 2 states
    cpt: Map<string, number>;  // Conditional probabilities
}

export interface Edge {
    id: string;
    from: string;    // Source node ID
    to: string;      // Target node ID
}

export interface Network {
    id: string;
    name: string;
    nodes: Map<string, Node>;
    edges: Map<string, Edge>;

    // Core operations
    addNode(node: Node): void;
    getNode(id: string): Node | undefined;
    hasNode(id: string): boolean;

    addEdge(edge: Edge): void;
    getEdge(id: string): Edge | undefined;
    hasEdge(id: string): boolean;

    // Network validation
    isValid(): boolean;
}
