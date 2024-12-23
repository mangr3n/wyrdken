import { Network, Node } from './types/Network';

export class BayesianNetwork implements Network {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _nodes: Map<string, Node>;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this._nodes = new Map<string, Node>();
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get nodes(): Map<string, Node> {
        return new Map(this._nodes);  // Return a copy to prevent direct mutation
    }

    addNode(node: Node): void {
        if (this._nodes.has(node.id)) {
            throw new Error(`Node with id ${node.id} already exists`);
        }
        this._nodes.set(node.id, { ...node });  // Store a copy
    }

    getNode(id: string): Node | undefined {
        const node = this._nodes.get(id);
        return node ? { ...node } : undefined;  // Return a copy if found
    }

    hasNode(id: string): boolean {
        return this._nodes.has(id);
    }

    isValid(): boolean {
        // Check that all parent references are valid
        for (const node of this._nodes.values()) {
            for (const parentId of node.parents) {
                if (!this._nodes.has(parentId)) {
                    return false;
                }
            }
        }
        return true;
    }

    getNodeCount(): number {
        return this._nodes.size;
    }

    getEdgeCount(): number {
        let edgeCount = 0;
        for (const node of this._nodes.values()) {
            edgeCount += node.parents.length;
        }
        return edgeCount;
    }
}
