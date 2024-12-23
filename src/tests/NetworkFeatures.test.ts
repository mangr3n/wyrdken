import { describe, it, expect, beforeEach } from 'vitest'
import { BayesianNetwork } from '../core/Network'
import { NetworkRunner } from '../core/NetworkRunner'
import { Node } from '../core/types/Network'

describe('Network Features Verification', () => {
    let network: BayesianNetwork;
    let runner: NetworkRunner;

    beforeEach(() => {
        network = new BayesianNetwork('test', 'Test Network');
        // Create a simple weather node
        const weatherNode: Node = {
            id: 'weather',
            name: 'Weather',
            states: ['sunny', 'rainy', 'cloudy'],
            parents: [],
            cpt: new Map([
                ['weather:sunny|', 0.6],
                ['weather:rainy|', 0.3],
                ['weather:cloudy|', 0.1]
            ])
        };
        network.addNode(weatherNode);
        runner = new NetworkRunner(network);
    });

    describe('1. Evidence Setting and Clearing', () => {
        it('should successfully set valid evidence', () => {
            // Set valid evidence
            expect(() => runner.setEvidence('weather', 'sunny')).not.toThrow();
            
            // Verify through internal state (we'd normally avoid this, but it's for verification)
            const evidence = (runner as any).evidence;
            expect(evidence.get('weather')).toBe('sunny');
        });

        it('should reject invalid evidence states', () => {
            // Try to set invalid state
            expect(() => runner.setEvidence('weather', 'snowy')).toThrow();
        });

        it('should reject evidence for non-existent nodes', () => {
            // Try to set evidence for non-existent node
            expect(() => runner.setEvidence('temperature', 'hot')).toThrow();
        });

        it('should clear evidence successfully', () => {
            // Set and then clear evidence
            runner.setEvidence('weather', 'sunny');
            runner.clearEvidence();
            
            // Verify through internal state
            const evidence = (runner as any).evidence;
            expect(evidence.size).toBe(0);
        });
    });

    describe('2. Basic Probability Lookup', () => {
        it('should return correct probabilities for root nodes', () => {
            const sunnyProb = runner.getProbability('weather', 'sunny');
            const rainyProb = runner.getProbability('weather', 'rainy');
            const cloudyProb = runner.getProbability('weather', 'cloudy');

            expect(sunnyProb).toBe(0.6);
            expect(rainyProb).toBe(0.3);
            expect(cloudyProb).toBe(0.1);
            expect(sunnyProb + rainyProb + cloudyProb).toBe(1);
        });

        it('should throw error for invalid states', () => {
            expect(() => runner.getProbability('weather', 'snowy')).toThrow();
        });

        it('should throw error for non-existent nodes', () => {
            expect(() => runner.getProbability('temperature', 'hot')).toThrow();
        });
    });

    describe('3. Evidence Validation', () => {
        it('should validate node existence', () => {
            expect(() => runner.setEvidence('nonexistent', 'state')).toThrow();
        });

        it('should validate state existence', () => {
            expect(() => runner.setEvidence('weather', 'invalid')).toThrow();
        });

        it('should allow setting evidence to different valid states', () => {
            expect(() => runner.setEvidence('weather', 'sunny')).not.toThrow();
            expect(() => runner.setEvidence('weather', 'rainy')).not.toThrow();
            expect(() => runner.setEvidence('weather', 'cloudy')).not.toThrow();
        });
    });

    describe('4. Current Limitations', () => {
        it('demonstrates limitation with parent nodes', () => {
            // Add a node with a parent
            const umbrellaNode: Node = {
                id: 'umbrella',
                name: 'Umbrella',
                states: ['yes', 'no'],
                parents: ['weather'],
                cpt: new Map([
                    ['umbrella:yes|rainy', 0.9],
                    ['umbrella:no|rainy', 0.1],
                    ['umbrella:yes|sunny', 0.2],
                    ['umbrella:no|sunny', 0.8],
                    ['umbrella:yes|cloudy', 0.4],
                    ['umbrella:no|cloudy', 0.6]
                ])
            };
            network.addNode(umbrellaNode);

            // Current implementation returns 0 for nodes with parents
            expect(runner.getProbability('umbrella', 'yes')).toBe(0);
            expect(runner.getProbability('umbrella', 'no')).toBe(0);
        });
    });
});
