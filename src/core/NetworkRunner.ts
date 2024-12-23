import { Network, Node } from './types/Network';

export class NetworkRunner {
    private readonly network: Network;
    private readonly evidence: Map<string, string>;

    constructor(network: Network) {
        this.network = network;
        this.evidence = new Map<string, string>();
    }

    // Set evidence for a node
    setEvidence(nodeId: string, state: string): void {
        const node = this.network.getNode(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found`);
        }
        if (!node.states.includes(state)) {
            throw new Error(`Invalid state ${state} for node ${nodeId}`);
        }
        this.evidence.set(nodeId, state);
    }

    // Clear all evidence
    clearEvidence(): void {
        this.evidence.clear();
    }

    // Get probability for a specific node and state
    getProbability(nodeId: string, state: string): number {
        const node = this.network.getNode(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found`);
        }
        if (!node.states.includes(state)) {
            throw new Error(`Invalid state ${state} for node ${nodeId}`);
        }

        // If no parents, return base probability
        if (node.parents.length === 0) {
            const key = this.createCPTKey(node.id, state, []);
            return node.cpt.get(key) ?? 0;
        }

        // Get parent states from evidence
        const parentStates = node.parents.map(parentId => {
            return this.evidence.get(parentId);
        });

        // If any parent state is missing, return 0
        if (parentStates.includes(undefined)) {
            return 0;
        }

        // Create CPT key with parent states
        const key = this.createCPTKey(node.id, state, parentStates);
        return node.cpt.get(key) ?? 0;
    }

    private createCPTKey(nodeId: string, state: string, parentStates: string[]): string {
        return `${nodeId}:${state}|${parentStates.join(',')}`;
    }
}
