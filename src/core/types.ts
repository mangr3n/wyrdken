export interface State {
  id: string;
  label: string;
  description: string;
}

export interface Node {
  id: string;
  name: string;
  description: string;
  states: State[];
  metadata?: {
    reasoning?: string;
    context?: string;
  };
}

export interface Edge {
  id: string;
  from: string;  // Node ID
  to: string;    // Node ID
  description: string;
  strength: number;  // 0 to 1
  metadata?: {
    reasoning?: string;
  };
}

export interface Condition {
  parentStates: Record<string, string>;  // nodeId -> stateId
  probabilities: Record<string, number>; // stateId -> probability
}

export interface CPT {
  nodeId: string;
  conditions: Condition[];
  metadata?: {
    reasoning?: string;
  };
}

export interface BayesianNetwork {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  cpts: CPT[];
  metadata?: {
    purpose?: string;
    context?: string;
    llmReasoning?: string;
  };
}
