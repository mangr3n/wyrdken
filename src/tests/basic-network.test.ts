import { describe, it, expect, beforeEach } from 'vitest'
import { BayesianNetwork } from '../core/Network'
import { NetworkRunner } from '../core/NetworkRunner'
import { Node } from '../core/types/Network'

describe('Basic Network Functionality', () => {
    let network: BayesianNetwork;
    let runner: NetworkRunner;

    beforeEach(() => {
        // Set up a fresh network and runner for each test
        network = new BayesianNetwork('test', 'Test Network');
        
        // Create a simple weather node
        const weatherNode: Node = {
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
        runner = new NetworkRunner(network);
    });

    describe('Evidence Setting/Clearing', () => {
        it('should set valid evidence', () => {
            expect(() => {
                runner.setEvidence('weather', 'sunny');
            }).not.toThrow();
        });

        it('should clear evidence', () => {
            runner.setEvidence('weather', 'sunny');
            runner.clearEvidence();
            // We can verify the evidence is cleared by trying to set it again
            expect(() => {
                runner.setEvidence('weather', 'sunny');
            }).not.toThrow();
        });
    });

    describe('Basic Probability Lookup', () => {
        it('should return correct probability for root node', () => {
            const sunnyProb = runner.getProbability('weather', 'sunny');
            const rainyProb = runner.getProbability('weather', 'rainy');
            
            expect(sunnyProb).toBe(0.7);
            expect(rainyProb).toBe(0.3);
        });

        it('should have probabilities sum to 1', () => {
            const sunnyProb = runner.getProbability('weather', 'sunny');
            const rainyProb = runner.getProbability('weather', 'rainy');
            
            expect(sunnyProb + rainyProb).toBe(1);
        });
    });

    describe('Evidence Validation', () => {
        it('should reject invalid node ID', () => {
            expect(() => {
                runner.setEvidence('nonexistent', 'sunny');
            }).toThrow();
        });

        it('should reject invalid state', () => {
            expect(() => {
                runner.setEvidence('weather', 'snowing');
            }).toThrow();
        });

        it('should accept all valid states', () => {
            expect(() => {
                runner.setEvidence('weather', 'sunny');
            }).not.toThrow();
            
            expect(() => {
                runner.setEvidence('weather', 'rainy');
            }).not.toThrow();
        });
    });
});
