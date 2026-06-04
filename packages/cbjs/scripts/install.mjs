/**
 * Install the native package matching the runtime environment.
 */
import fs from 'node:fs';
import path from 'node:path';

import { downloadBinary } from './utils/downloadBinary.mjs';
import { resolveBinaryTarget } from './utils/resolveBinaryTarget.mjs';

const packageAbsolutePath = process.cwd();
const packageRelative = 'packages/cbjs';
const isProjectDev =
  process.env.INIT_CWD === undefined ||
  packageAbsolutePath === process.env.INIT_CWD ||
  packageAbsolutePath.substring(process.env.INIT_CWD.length) === `/${packageRelative}`;

const target = resolveBinaryTarget({ version: process.argv[2] });

console.info(
  `Resolving Couchbase binary for ${target.platform}/${target.arch}` +
    (target.isOverridden ? ' (override)' : '')
);

const buildOutputDirectory = path.resolve(packageAbsolutePath, 'dist/src');

if (!fs.existsSync(buildOutputDirectory)) {
  fs.mkdirSync(buildOutputDirectory, { recursive: true });
}

const binaryDestinationPaths = [
  path.resolve(buildOutputDirectory, 'couchbase-native.node'),
];

if (isProjectDev) {
  binaryDestinationPaths.push(
    path.resolve(packageAbsolutePath, 'src/couchbase-native.node')
  );
}

// Skip the download only when no override is set: a forced cross-platform install
// must re-download, otherwise a stale binary from the build machine would be kept.
if (!target.isOverridden && binaryDestinationPaths.every((path) => fs.existsSync(path))) {
  console.info(`Couchbase binary is already installed.`);
  process.exit(0);
}

downloadBinary(
  target.binaryPackageName,
  target.version,
  target.binarySourcePath,
  binaryDestinationPaths
)
  .then(() => console.info(`Couchbase binary has been installed.`))
  .catch((err) => console.error(err));
