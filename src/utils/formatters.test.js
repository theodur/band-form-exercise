import { centsToDollars } from './formatters';

describe('centsToDollars', () => {
  it('converts cents to dollars with two decimal points', () => {
    expect(centsToDollars(12345)).toBe('123.45');
  });

  it('returns whole dollars without decimals if the decimal part is .00', () => {
    expect(centsToDollars(10000)).toBe('100');
  });

  it('handles zero cents correctly', () => {
    expect(centsToDollars(0)).toBe('0');
  });

  it('returns "0" if the input is not a number', () => {
    expect(centsToDollars(null)).toBe('0');
    expect(centsToDollars(undefined)).toBe('0');
    expect(centsToDollars('string')).toBe('0');
    expect(centsToDollars({})).toBe('0');
  });

  it('handles negative cents correctly', () => {
    expect(centsToDollars(-12345)).toBe('-123.45');
    expect(centsToDollars(-10000)).toBe('-100');
  });

  it('handle fractional cents correctly', () => {
    expect(centsToDollars(123.45)).toBe('1.23');
  });
});
