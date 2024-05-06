import { ServerFeature, versionSupports } from '@cbjsdev/http-client';

import { clusterRelease } from './clusterRelease.js';

export function serverSupportsFeatures(...features: ServerFeature[]): boolean {
  return features.every((f) => versionSupports(clusterRelease.version, f));
}
