import { describe, it, expect } from 'vitest'
import { BayesianNetwork } from '../core/Network'
import { NetworkRunner } from '../core/NetworkRunner'

describe('NetworkRunner Basic Operation', () => {
    it('should create a NetworkRunner with a network', () => {
        const network = new BayesianNetwork('test', 'Test Network')
        const runner = new NetworkRunner(network)
        
        // Verify runner was created
        expect(runner).toBeInstanceOf(NetworkRunner)
    })

    it('should expose expected methods', () => {
        const network = new BayesianNetwork('test', 'Test Network')
        const runner = new NetworkRunner(network)
        
        // Verify methods exist and are functions
        expect(typeof runner.setEvidence).toBe('function')
        expect(typeof runner.clearEvidence).toBe('function')
        expect(typeof runner.getProbability).toBe('function')
    })
})
