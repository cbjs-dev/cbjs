import { connect } from '@cbjs/cbjs';
import { getConnectionParams } from '@cbjs/shared';

import { isOptimized } from '../../utils/optimization';

const bucketName = process.argv[2];
const prefix = Math.random().toString(16).substring(2, 8);

const params = getConnectionParams();
const cluster = await connect(params.connectionString, {
  username: params.credentials.username,
  password: params.credentials.password,
});

const promises = [];
const insert = cluster.bucket(bucketName).defaultCollection().insert;

for (let i = 0; i < 200; i++) {
  promises.push(insert(`optimizationDoc_${prefix}_${i}`, 'hi'));
  promises.push(
    insert(`optimizationDoc_${prefix}_${i}_opts`, 'hi', {
      timeout: 500,
    })
  );

  promises.push(
    insert(`optimizationDoc_${prefix}_${i}_cb`, 'hi', (err, res) => {
      if (err) return;
      const { token } = res;
    })
  );

  promises.push(
    insert(
      `optimizationDoc_${prefix}_${i}_opts_cb`,
      'hi',
      { timeout: 500 },
      (err, res) => {
        if (err) return;
        const { token } = res;
      }
    )
  );
}

await Promise.allSettled(promises);

console.log(isOptimized(insert));
