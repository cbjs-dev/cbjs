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

  it('should be true for a vector key', ({ expect }) => {
    expect(areSameIndexKeys(['vector VECTOR'], ['`vector` VECTOR'])).toBe(true);
    expect(areSameIndexKeys(['vector vector'], ['`vector` VECTOR'])).toBe(true);
  });

  it('should be true for a descending key', ({ expect }) => {
    expect(areSameIndexKeys(['a.b DESC'], ['(`a`.`b`) DESC'])).toBe(true);
  });

  it('should be true when the ascending modifier is explicit', ({ expect }) => {
    expect(areSameIndexKeys(['a ASC'], ['`a`'])).toBe(true);
  });

  it('should be true for a key including the missing values', ({ expect }) => {
    expect(
      areSameIndexKeys(['a INCLUDE MISSING DESC'], ['`a` INCLUDE MISSING DESC'])
    ).toBe(true);
  });

  it('should be false when a modifier differs', ({ expect }) => {
    expect(areSameIndexKeys(['a'], ['`a` DESC'])).toBe(false);
    expect(areSameIndexKeys(['vector'], ['`vector` VECTOR'])).toBe(false);
    expect(areSameIndexKeys(['a INCLUDE MISSING'], ['`a`'])).toBe(false);
  });
});
