/**
 * Install the native package matching the runtime environment.
 */
import fs from 'node:fs';
import path from 'node:path';
import { downloadBinary } from './downloadBinary.mjs';

const packageAbsolutePath = process.cwd();
const packageRelative = 'packages/cbjs';
const isProjectDev = process.env.INIT_CWD === undefined || (packageAbsolutePath.substring(process.env.INIT_CWD.length) === `/${packageRelative}`);

const arch = process.arch;
const platform = process.platform;
const sslType = 'boringssl';

const binaryPackageName = `couchbase-${platform}-${arch}-napi`;
const binaryPackageVersion = process.env.COUCHBASE_BINARY_VERSION || process.argv[2];
const binarySourcePath = `package/couchbase-v${binaryPackageVersion}-napi-v6-${platform}-${arch}-${sslType}.node`;
const binaryDestinationPath = isProjectDev ?
  path.resolve(packageAbsolutePath, `src/couchbase-native.node`) :
  path.resolve(packageAbsolutePath, 'dist/couchbase-native.node');

if (fs.existsSync(binaryDestinationPath)) {
  console.info(`Couchbase binary is already installed in ${binaryDestinationPath}`)
  process.exit(0);
}

downloadBinary(binaryPackageName, binaryPackageVersion, binarySourcePath, binaryDestinationPath)
.then(() => console.info(`Couchbase binary has been installed in ${binaryDestinationPath}`))
.catch((err) => console.error(err))
