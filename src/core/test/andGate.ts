import { BayesianNetwork } from '../BayesianNetwork';
import { BayesianNetwork as IBayesianNetwork } from '../types';

const andGateNetwork: IBayesianNetwork = {
  id: "and_gate",
  name: "AND Gate",
  description: "Models a basic AND logic gate",
  
  nodes: [
    {
      id: "input_a",
      name: "Input A",
      description: "First input to AND gate",
      states: [
        { id: "false", label: "False", description: "0" },
        { id: "true", label: "True", description: "1" }
      ],
      metadata: {
        reasoning: "Binary input representing logical true/false"
      }
    },
    {
      id: "input_b",
      name: "Input B",
      description: "Second input to AND gate",
      states: [
        { id: "false", label: "False", description: "0" },
        { id: "true", label: "True", description: "1" }
      ],
      metadata: {
        reasoning: "Binary input representing logical true/false"
      }
    },
    {
      id: "output",
      name: "Output",
      description: "AND gate output",
      states: [
        { id: "false", label: "False", description: "0" },
        { id: "true", label: "True", description: "1" }
      ],
      metadata: {
        reasoning: "Output is true only when both inputs are true"
      }
    }
  ],

  edges: [
    {
      id: "a_to_output",
      from: "input_a",
      to: "output",
      description: "Input A influences output",
      strength: 1.0,
      metadata: {
        reasoning: "Direct logical dependency"
      }
    },
    {
      id: "b_to_output",
      from: "input_b",
      to: "output",
      description: "Input B influences output",
      strength: 1.0,
      metadata: {
        reasoning: "Direct logical dependency"
      }
    }
  ],

  cpts: [
    {
      nodeId: "output",
      conditions: [
        {
          parentStates: { input_a: "true", input_b: "true" },
          probabilities: { false: 0.0, true: 1.0 }
        },
        {
          parentStates: { input_a: "true", input_b: "false" },
          probabilities: { false: 1.0, true: 0.0 }
        },
        {
          parentStates: { input_a: "false", input_b: "true" },
          probabilities: { false: 1.0, true: 0.0 }
        },
        {
          parentStates: { input_a: "false", input_b: "false" },
          probabilities: { false: 1.0, true: 0.0 }
        }
      ],
      metadata: {
        reasoning: "Classic AND gate truth table: true only when both inputs are true"
      }
    }
  ],

  metadata: {
    purpose: "Demonstrate boolean logic as a Bayesian Network",
    context: "Digital logic implementation",
    llmReasoning: "This network shows how deterministic boolean operations can be represented probabilistically"
  }
};

// Test the AND gate
function testAndGate() {
  const network = new BayesianNetwork(andGateNetwork);
  
  // Test all possible input combinations
  const testCases = [
    { input_a: "true", input_b: "true" },
    { input_a: "true", input_b: "false" },
    { input_a: "false", input_b: "true" },
    { input_a: "false", input_b: "false" }
  ];

  for (const evidence of testCases) {
    const result = network.query("output", evidence);
    console.log(`Input A: ${evidence.input_a}, Input B: ${evidence.input_b}`);
    console.log(`Output probabilities:`, result);
    console.log('---');
  }
}

testAndGate();
