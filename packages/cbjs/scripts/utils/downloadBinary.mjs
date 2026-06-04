import fs from 'node:fs';
import https from 'node:https';
import tar from 'tar';

/**
 * Build the npm registry tarball URL for a given native package.
 *
 * @param packageName {string}
 * @param packageVersion {string}
 * @returns {string}
 */
export function buildBinaryUrl(packageName, packageVersion) {
  return `https://registry.npmjs.org/@couchbase/${packageName}/-/${packageName}-${packageVersion}.tgz`;
}

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
        if (response.statusCode !== 200) {
          response.resume();
          reject(
            new Error(
              `Failed to download Couchbase binary ${packageName}@${packageVersion} ` +
                `(HTTP ${response.statusCode}). This platform/arch combination may not ` +
                `be published on npm. URL: ${url}`
            )
          );
          return;
        }
        
        let writeComplete;

        const extractor = new tar.Parse({
          onentry: (entry) => {
            if (entry.path === binarySourcePath) {
              const output = fs.createWriteStream(binaryDestinationPath);
              writeComplete = new Promise((resolveWrite, rejectWrite) => {
                output.on('finish', resolveWrite);
                output.on('error', rejectWrite);
              });
              entry.pipe(output);
            } else {
              entry.resume();
            }
          },
        });

        extractor.on('error', reject);
        extractor.on('end', () => {
          if (!writeComplete) {
            reject(
              new Error(
                `Couchbase binary ${binarySourcePath} was not found in ` +
                  `${packageName}@${packageVersion}.`
              )
            );
            return;
          }

          writeComplete.then(resolve, reject);
        });

        response.pipe(extractor);
      })
      .on('error', reject);
  });

  await download;

  copyToPaths.forEach((path) => {
    fs.copyFileSync(binaryDestinationPath, path);
  });
}
