import { describe, it } from 'vitest';

import { areSameIndexOptions } from './areSameIndexOptions.js';

describe('areSameIndexOptions', () => {
  it('should be true when no options are requested', ({ expect }) => {
    expect(areSameIndexOptions(undefined, undefined)).toBe(true);
    expect(areSameIndexOptions(undefined, { dimension: 768 })).toBe(true);
  });

  it('should be true for identical options', ({ expect }) => {
    expect(
      areSameIndexOptions(
        { dimension: 768, similarity: 'DOT', description: 'IVF,SQ8' },
        { dimension: 768, similarity: 'DOT', description: 'IVF,SQ8' }
      )
    ).toBe(true);
  });

  it('should ignore the options reported by the cluster but not requested', ({
    expect,
  }) => {
    expect(
      areSameIndexOptions(
        { dimension: 768 },
        { dimension: 768, num_partition: 1, num_replica: 0, scan_nprobes: 1 }
      )
    ).toBe(true);
  });

  it('should ignore the number of replicas, which is altered rather than recreated', ({
    expect,
  }) => {
    expect(areSameIndexOptions({ num_replica: 2 }, { num_replica: 0 })).toBe(true);
  });

  it('should compare undocumented options', ({ expect }) => {
    expect(areSameIndexOptions({ some_new_option: 1 }, { some_new_option: 1 })).toBe(
      true
    );
    expect(areSameIndexOptions({ some_new_option: 1 }, { some_new_option: 2 })).toBe(
      false
    );
  });

  it('should compare string options case insensitively', ({ expect }) => {
    expect(areSameIndexOptions({ similarity: 'DOT' }, { similarity: 'dot' })).toBe(true);
  });

  it('should compare array options', ({ expect }) => {
    expect(
      areSameIndexOptions({ nodes: ['node1:8091'] }, { nodes: ['node1:8091'] })
    ).toBe(true);
    expect(
      areSameIndexOptions({ nodes: ['node1:8091'] }, { nodes: ['node2:8091'] })
    ).toBe(false);
  });

  it('should be false when a requested option differs', ({ expect }) => {
    expect(areSameIndexOptions({ dimension: 768 }, { dimension: 1536 })).toBe(false);
    expect(areSameIndexOptions({ similarity: 'DOT' }, { similarity: 'cosine' })).toBe(
      false
    );
  });

  it('should be false when a requested option is missing on the cluster', ({
    expect,
  }) => {
    expect(areSameIndexOptions({ dimension: 768 }, undefined)).toBe(false);
    expect(areSameIndexOptions({ dimension: 768 }, { similarity: 'DOT' })).toBe(false);
  });
});
