import { connect } from '@cbjsdev/cbjs';
import { getConnectionParams } from '@cbjsdev/shared';

import { isOptimized } from '../../utils/optimization.js';

const bucketName = process.argv[2];
const prefix = Math.random().toString(16).substring(2, 8);

const params = getConnectionParams();
const cluster = await connect(params.connectionString, {
  username: params.credentials.username,
  password: params.credentials.password,
});

const promises = [];
const collection = cluster.bucket(bucketName).defaultCollection();

for (let i = 0; i < 1500; i++) {
  promises.push(collection.insert(`optimizationDoc_${prefix}_${i}`, 'hi'));
  promises.push(
    collection.insert(`optimizationDoc_${prefix}_${i}_opts`, 'hi', {
      timeout: 500,
    })
  );

  promises.push(
    collection.insert(`optimizationDoc_${prefix}_${i}_cb`, 'hi', (err, res) => {
      if (err) return;
      if (typeof res !== 'object') throw new Error('Invalid response');
    })
  );

  promises.push(
    collection.insert(
      `optimizationDoc_${prefix}_${i}_opts_cb`,
      'hi',
      { timeout: 500 },
      (err, res) => {
        if (err) return;
        if (typeof res !== 'object') throw new Error('Invalid response');
      }
    )
  );
}

await Promise.allSettled(promises);

// eslint-disable-next-line @typescript-eslint/unbound-method
console.log(isOptimized(collection.insert));
