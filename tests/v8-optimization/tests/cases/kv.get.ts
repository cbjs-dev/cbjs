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

const insertPromises = [];
const getPromises = [];
const insert = cluster.bucket(bucketName).defaultCollection().insert;
const get = cluster.bucket(bucketName).defaultCollection().get;

for (let i = 0; i < 200; i++) {
  insertPromises.push(insert(`optimizationDoc_${prefix}_${i}`, 'hi'));
}

await Promise.allSettled(insertPromises);

for (let i = 0; i < 2000; i++) {
  getPromises.push(get(`optimizationDoc_${prefix}_${i}`));
  getPromises.push(
    get(`optimizationDoc_${prefix}_${i}`, {
      timeout: 500,
    })
  );

  getPromises.push(
    get(`optimizationDoc_${prefix}_${i}`, (err, res) => {
      if (err) return;
      const { content } = res;
    })
  );

  getPromises.push(
    get(`optimizationDoc_${prefix}_${i}`, { timeout: 500 }, (err, res) => {
      if (err) return;
      const { content } = res;
    })
  );
}

await Promise.allSettled(getPromises);

console.log(isOptimized(get));
