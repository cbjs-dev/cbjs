import https from 'node:https';
import fs from 'node:fs';
import tar from 'tar';

export function downloadBinary(packageName, packageVersion, binarySourcePath, binaryDestinationPath) {
  const url = `https://registry.npmjs.org/@couchbase/${packageName}/-/${packageName}-${packageVersion}.tgz`;

  console.info('Downloading Couchbase binary', url);

  return new Promise((resolve, reject) => {

    https.get(url, response => {
      const extractor = new tar.Parse({
        onentry: entry => {
          if (entry.path === binarySourcePath) {
            const output = fs.createWriteStream(binaryDestinationPath);
            entry.pipe(output);
          } else {
            entry.resume();
          }
        }
      });

      extractor.on('error', reject);
      extractor.on('end', resolve);

      response.pipe(extractor);
    }).on('error', reject);
  });
}
