import { describe, expectTypeOf, it } from 'vitest';

import { CppConnection } from '@cbjsdev/cbjs/internal';

import { getAllArgsTransformFunctions } from './createConnectionProxy.js';
import { passthrough } from './proxyFunctions/passthrough.js';

describe('createConnectionProxy', () => {
  it('should have not forgotten any method', () => {
    const transformArgs = getAllArgsTransformFunctions();

    // This type is used to be sure we didn't forget any CppConnection methods
    type MissingHandlers = Exclude<
      keyof CppConnection,
      keyof typeof transformArgs | (typeof passthrough)[number]
    >;

    expectTypeOf<MissingHandlers>().toBeNever();
  });
});
