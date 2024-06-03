import { describe, expectTypeOf, it } from 'vitest';

import { connect } from './couchbase.js';
import { QueryMetrics } from './querytypes.js';

describe('scope', () => {
  it('should infer the metrics type from the query options', async () => {
    const cluster = await connect('...');

    // Missing metrics
    const result = await cluster
      .bucket('store')
      .scope('library')
      .query('SELECT * FROM books');
    expectTypeOf(result.meta.metrics).toEqualTypeOf<undefined>();

    // Metrics present
    const resultWithMetrics = await cluster
      .bucket('store')
      .scope('library')
      .query('SELECT * FROM store', {
        metrics: true,
      });

    expectTypeOf(resultWithMetrics.meta.metrics).toEqualTypeOf<QueryMetrics>();
  });
});
