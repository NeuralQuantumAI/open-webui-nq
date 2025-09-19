import { describe, it, expect } from 'vitest';

// Basic utility functions for testing
export function add(a: number, b: number): number {
	return a + b;
}

export function multiply(a: number, b: number): number {
	return a * b;
}

// Test cases
describe('Utils', () => {
	it('should add two numbers', () => {
		expect(add(2, 3)).toBe(5);
		expect(add(-1, 1)).toBe(0);
		expect(add(0, 0)).toBe(0);
	});

	it('should multiply two numbers', () => {
		expect(multiply(2, 3)).toBe(6);
		expect(multiply(-1, 1)).toBe(-1);
		expect(multiply(0, 5)).toBe(0);
	});
});