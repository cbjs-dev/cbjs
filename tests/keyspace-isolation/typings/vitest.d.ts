import { TaskContext } from 'vitest';

import { Cluster } from '@cbjsdev/cbjs';

declare module 'vitest' {
  interface TaskContext {
    cluster: Cluster;
    getCluster: () => Promise<Cluster>;
  }
}
