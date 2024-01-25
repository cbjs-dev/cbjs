/**
 * Install the native package matching the runtime environment.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { downloadBinary } from './downloadBinary.mjs';
import { isElectron, isAlpine, getNodeVersion, getNodeMajorVersion, getSSLType, getLinuxType } from './utils.mjs';

const packageDir = process.cwd();
const isProjectDev = process.env.INIT_CWD === undefined || (process.env.INIT_CWD === process.cwd());

const runtime = isElectron() ? 'electron' : 'node';
const nodeVersion = getNodeVersion();
const nodeVersionMajor = getNodeMajorVersion(nodeVersion);
const arch = process.arch;
const platform = process.platform;
const libc = getLinuxType(platform);
const sslType = 'boringssl';

const binaryPackageName = `couchbase-${platform}-${arch}-napi`;
const binaryPackageVersion = process.env.COUCHBASE_BINARY_VERSION || process.argv[2];
const binarySourcePath = `package/couchbase-v${binaryPackageVersion}-napi-v6-${platform}-${arch}-${sslType}.node`;
const binaryDestinationPath = isProjectDev ?
  path.resolve(packageDir, `src/couchbase-native.node`) :
  path.resolve(packageDir, 'dist/couchbase-native.node');

if (fs.existsSync(binaryDestinationPath)) {
  console.info(`Couchbase binary is already installed in ${binaryDestinationPath}`)
  process.exit(0);
}

downloadBinary(binaryPackageName, binaryPackageVersion, binarySourcePath, binaryDestinationPath)
.then(() => console.info(`Couchbase binary has been installed in ${binaryDestinationPath}`))
.catch((err) => console.error(err))
