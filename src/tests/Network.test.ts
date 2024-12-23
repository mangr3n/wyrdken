import { describe, it, expect } from 'vitest'
import { BayesianNetwork } from '../core/Network'
import { NetworkRunner } from '../core/NetworkRunner'
import { Node } from '../core/types/Network'

describe('Basic Boolean Network', () => {
    it('should create a network with boolean nodes A, B, and X', () => {
        const network = new BayesianNetwork('test', 'Test Network')
        
        // Create input nodes A and B
        const nodeA: Node = {
            id: 'A',
            name: 'Input A',
            states: ['true', 'false'],
            parents: [],
            cpt: new Map([
                ['A:true|', 0.5],
                ['A:false|', 0.5]
            ])
        }

        const nodeB: Node = {
            id: 'B',
            name: 'Input B',
            states: ['true', 'false'],
            parents: [],
            cpt: new Map([
                ['B:true|', 0.5],
                ['B:false|', 0.5]
            ])
        }

        // Create output node X
        const nodeX: Node = {
            id: 'X',
            name: 'Output X',
            states: ['true', 'false'],
            parents: ['A', 'B'],
            cpt: new Map([
                ['X:true|true,true', 1.0],
                ['X:true|true,false', 0.0],
                ['X:true|false,true', 0.0],
                ['X:true|false,false', 0.0],
                ['X:false|true,true', 0.0],
                ['X:false|true,false', 1.0],
                ['X:false|false,true', 1.0],
                ['X:false|false,false', 1.0]
            ])
        }

        // Add nodes to network
        network.addNode(nodeA)
        network.addNode(nodeB)
        network.addNode(nodeX)

        // Verify network structure
        expect(network.getNodeCount()).toBe(3)
        expect(network.getEdgeCount()).toBe(2)  // X has two parents
        expect(network.isValid()).toBe(true)

        // Create runner and test probabilities
        const runner = new NetworkRunner(network)

        // Test with no evidence
        expect(runner.getProbability('A', 'true')).toBe(0.5)
        expect(runner.getProbability('B', 'true')).toBe(0.5)

        // Set evidence and test
        runner.setEvidence('A', 'true')
        runner.setEvidence('B', 'true')
        expect(runner.getProbability('X', 'true')).toBe(1.0)

        // Change evidence
        runner.setEvidence('B', 'false')
        expect(runner.getProbability('X', 'false')).toBe(1.0)

        // Clear evidence
        runner.clearEvidence()
        expect(runner.getProbability('A', 'true')).toBe(0.5)
    })
})
