import fs from 'node:fs';
import https from 'node:https';
import tar from 'tar';

/**
 *
 * @param packageName {string}
 * @param packageVersion {string}
 * @param binarySourcePath {string}
 * @param binaryDestinationPaths {string[]}
 * @returns {Promise<void>}
 */
export async function downloadBinary(
  packageName,
  packageVersion,
  binarySourcePath,
  binaryDestinationPaths
) {
  const url = `https://registry.npmjs.org/@couchbase/${packageName}/-/${packageName}-${packageVersion}.tgz`;

  console.info('Downloading Couchbase binary', url);

  const [binaryDestinationPath, ...copyToPaths] = binaryDestinationPaths;

  const download = new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const extractor = new tar.Parse({
          onentry: (entry) => {
            if (entry.path === binarySourcePath) {
              const output = fs.createWriteStream(binaryDestinationPath);
              entry.pipe(output);
            } else {
              entry.resume();
            }
          },
        });

        extractor.on('error', reject);
        extractor.on('end', resolve);

        response.pipe(extractor);
      })
      .on('error', reject);
  });

  await download;

  copyToPaths.forEach((path) => {
    fs.copyFileSync(binaryDestinationPath, path);
  });
}
