import { describe, it, expect } from 'vitest'

describe('Vitest Setup', () => {
    it('should pass a simple test', () => {
        expect(1 + 1).toBe(2)
    })

    it('should handle basic async operations', async () => {
        const result = await Promise.resolve(42)
        expect(result).toBe(42)
    })

    it('should support typescript', () => {
        const add = (a: number, b: number): number => a + b
        expect(add(2, 2)).toBe(4)
    })
})
