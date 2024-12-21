import { BayesianNetwork as IBayesianNetwork, Node, Edge, CPT, Condition } from './types';

export class BayesianNetwork {
  private nodes: Map<string, Node>;
  private edges: Map<string, Edge>;
  private cpts: Map<string, CPT>;
  private metadata: IBayesianNetwork['metadata'];

  constructor(network: IBayesianNetwork) {
    this.nodes = new Map(network.nodes.map(node => [node.id, node]));
    this.edges = new Map(network.edges.map(edge => [edge.id, edge]));
    this.cpts = new Map(network.cpts.map(cpt => [cpt.nodeId, cpt]));
    this.metadata = network.metadata;
  }

  private getParents(nodeId: string): Node[] {
    return Array.from(this.edges.values())
      .filter(edge => edge.to === nodeId)
      .map(edge => this.nodes.get(edge.from)!)
      .filter(Boolean);
  }

  private findMatchingCondition(nodeId: string, parentStates: Record<string, string>): Condition | undefined {
    const cpt = this.cpts.get(nodeId);
    if (!cpt) return undefined;

    return cpt.conditions.find(condition => {
      const parentStateEntries = Object.entries(condition.parentStates);
      return parentStateEntries.every(([parentId, stateId]) => 
        parentStates[parentId] === stateId
      );
    });
  }

  public query(nodeId: string, evidence: Record<string, string>): Record<string, number> {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);

    // If node is in evidence, return deterministic probability
    if (nodeId in evidence) {
      const state = evidence[nodeId];
      return Object.fromEntries(
        node.states.map(s => [s.id, s.id === state ? 1.0 : 0.0])
      );
    }

    // Get parent states from evidence
    const parents = this.getParents(nodeId);
    const parentStates: Record<string, string> = {};
    for (const parent of parents) {
      if (!(parent.id in evidence)) {
        throw new Error(`Missing evidence for parent node ${parent.id}`);
      }
      parentStates[parent.id] = evidence[parent.id];
    }

    // Find matching condition in CPT
    const condition = this.findMatchingCondition(nodeId, parentStates);
    if (!condition) {
      throw new Error(`No matching condition found for node ${nodeId} with parent states ${JSON.stringify(parentStates)}`);
    }

    return condition.probabilities;
  }

  // Helper method to validate evidence against node states
  public validateEvidence(evidence: Record<string, string>): boolean {
    for (const [nodeId, stateId] of Object.entries(evidence)) {
      const node = this.nodes.get(nodeId);
      if (!node) return false;
      if (!node.states.some(state => state.id === stateId)) return false;
    }
    return true;
  }
}
