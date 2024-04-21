import { TaskContext } from 'vitest';

import { Cluster } from '@cbjsdev/cbjs';
import { ConnectionParams } from '@cbjsdev/shared';

declare module 'vitest' {
  interface TaskContext {
    getCluster: () => Promise<Cluster>;
    getConnectionParams: () => ConnectionParams;
  }
}
