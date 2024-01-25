import fs from 'node:fs';

export function getLinuxType(platform) {
  if (platform !== 'linux') {
    return ''
  }
  return `linux${isAlpine(platform) ? 'musl' : ''}`
}


export function getSSLType(runtime, version) {
  if (runtime === 'electron') {
    return 'boringssl'
  }

  const major = getNodeMajorVersion(version)
  if (major >= 18) {
    return 'openssl3'
  }
  return 'openssl1'
}

export function getNodeVersion() {
  return process.version.replace('v', '')
}

export function getNodeMajorVersion(version) {
  const tokens = version.split('.')
  return parseInt(tokens[0])
}

export function isElectron() {
  if (process.versions && process.versions.electron) return true
  if (process.env.ELECTRON_RUN_AS_NODE) return true
  return (
    typeof window !== 'undefined' &&
    window.process &&
    window.process.type === 'renderer'
  )
}

export function isAlpine(platform) {
  try {
    return platform === 'linux' && fs.existsSync('/etc/alpine-release');
  } catch (err) {
    return false;
  }
}
