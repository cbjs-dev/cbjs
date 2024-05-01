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

const insertPromises = [];
const getPromises = [];
const collection = cluster.bucket(bucketName).defaultCollection();

for (let i = 0; i < 1000; i++) {
  insertPromises.push(collection.insert(`optimizationDoc_${prefix}_${i}`, 'hi'));
}

await Promise.allSettled(insertPromises);

for (let i = 0; i < 1000; i++) {
  getPromises.push(collection.get(`optimizationDoc_${prefix}_${i}`));
  getPromises.push(
    collection.get(`optimizationDoc_${prefix}_${i}`, {
      timeout: 500,
    })
  );

  getPromises.push(
    collection.get(`optimizationDoc_${prefix}_${i}`, (err, res) => {
      if (err) return;
      if (typeof res !== 'object') throw new Error('Invalid response');
    })
  );

  getPromises.push(
    collection.get(`optimizationDoc_${prefix}_${i}`, { timeout: 500 }, (err, res) => {
      if (err) return;
      if (typeof res !== 'object') throw new Error('Invalid response');
    })
  );
}

await Promise.allSettled(getPromises);

// eslint-disable-next-line @typescript-eslint/unbound-method
console.log(isOptimized(collection.get));
