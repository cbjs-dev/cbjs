/**
 * Install the native package matching the runtime environment.
 */
import fs from 'node:fs';
import path from 'node:path';

import { downloadBinary } from './utils/downloadBinary.mjs';

const packageAbsolutePath = process.cwd();
const packageRelative = 'packages/cbjs';
const isProjectDev =
  process.env.INIT_CWD === undefined ||
  packageAbsolutePath.substring(process.env.INIT_CWD.length) === `/${packageRelative}`;

const arch = process.arch;
const platform = process.platform;
const sslType = 'boringssl';

const binaryPackageName = `couchbase-${platform}-${arch}-napi`;
const binaryPackageVersion = process.env.COUCHBASE_BINARY_VERSION || process.argv[2];
const binarySourcePath = `package/couchbase-v${binaryPackageVersion}-napi-v6-${platform}-${arch}-${sslType}.node`;

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

if (binaryDestinationPaths.every((path) => fs.existsSync(path))) {
  console.info(`Couchbase binary is already installed.`);
  process.exit(0);
}

downloadBinary(
  binaryPackageName,
  binaryPackageVersion,
  binarySourcePath,
  binaryDestinationPaths
)
  .then(() => console.info(`Couchbase binary has been installed.`))
  .catch((err) => console.error(err));
