# Current Network Capabilities

## 1. Evidence Setting and Clearing

The system currently supports basic evidence management for Bayesian network nodes:

### Features
- Set evidence for any node to one of its valid states
- Clear all evidence from the network
- Validate evidence before setting

### Example
```typescript
const network = new BayesianNetwork('weather-net', 'Weather Network');
const runner = new NetworkRunner(network);

// Set evidence
runner.setEvidence('weather', 'sunny');  // Works
runner.setEvidence('weather', 'snowy');  // Throws error - invalid state
runner.setEvidence('temp', 'hot');       // Throws error - node doesn't exist

// Clear evidence
runner.clearEvidence();  // Removes all evidence
```

## 2. Basic Probability Lookup

The system supports probability lookup for root nodes (nodes without parents):

### Features
- Get probability for any state of a root node
- Validate state existence
- Validate node existence

### Example
```typescript
const weatherNode = {
    id: 'weather',
    name: 'Weather',
    states: ['sunny', 'rainy'],
    parents: [],
    cpt: new Map([
        ['weather:sunny|', 0.7],
        ['weather:rainy|', 0.3]
    ])
};

network.addNode(weatherNode);
const runner = new NetworkRunner(network);

const sunnyProb = runner.getProbability('weather', 'sunny');  // Returns 0.7
const rainyProb = runner.getProbability('weather', 'rainy');  // Returns 0.3
```

## 3. Evidence Validation

The system validates all evidence operations:

### Features
- Validates node existence before setting evidence
- Validates state existence for the node
- Prevents setting invalid states

### Example
```typescript
// Given a weather node with states ['sunny', 'rainy']
runner.setEvidence('weather', 'sunny');     // Valid
runner.setEvidence('weather', 'snowy');     // Error: Invalid state
runner.setEvidence('temperature', 'hot');   // Error: Node doesn't exist
```

## Current Limitations

The following features are not yet implemented:

1. **Full Bayesian Probability Calculation**
   - Cannot calculate probabilities for nodes with parents
   - No support for conditional probability calculations

2. **Evidence Propagation**
   - Evidence is stored but not propagated through the network
   - No impact on related node probabilities

3. **Joint Probability Calculations**
   - No support for calculating joint probabilities
   - Cannot determine probability of multiple events occurring together

4. **Multiple Parent Combinations**
   - CPT structure exists but not fully utilized
   - No calculation of probabilities based on parent state combinations

### Example of Limitation
```typescript
const umbrellaNode = {
    id: 'umbrella',
    name: 'Umbrella',
    states: ['yes', 'no'],
    parents: ['weather'],
    cpt: new Map([
        ['umbrella:yes|rainy', 0.9],
        ['umbrella:no|rainy', 0.1]
    ])
};

network.addNode(umbrellaNode);
runner.getProbability('umbrella', 'yes');  // Returns 0 - not yet implemented
```
