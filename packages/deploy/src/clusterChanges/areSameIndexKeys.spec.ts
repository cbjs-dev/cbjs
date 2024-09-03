import { describe, it } from 'vitest';

import { areSameIndexKeys } from './areSameIndexKeys.js';

describe('areSameIndexKeys', () => {
  it('should be true for empty keys', ({ expect }) => {
    expect(areSameIndexKeys([], [])).toBe(true);
  });

  it('should be true for a single quoteless identifier', ({ expect }) => {
    expect(areSameIndexKeys(['a'], ['a'])).toBe(true);
  });

  it('should be true for a single quoted identifier', ({ expect }) => {
    expect(areSameIndexKeys(['a'], ['`a`'])).toBe(true);
  });

  it('should be true for two single quoted identifier', ({ expect }) => {
    expect(areSameIndexKeys(['`a`'], ['`a`'])).toBe(true);
  });

  it('should be true for a couple of quoted identifiers', ({ expect }) => {
    expect(areSameIndexKeys(['a.b'], ['`a`.`b`'])).toBe(true);
  });

  it('should be true for a couple of wrapped and quoted identifiers', ({ expect }) => {
    expect(areSameIndexKeys(['a.b'], ['(`a`.`b`)'])).toBe(true);
  });
});
