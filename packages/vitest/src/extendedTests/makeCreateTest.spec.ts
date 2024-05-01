/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { describe, expectTypeOf } from 'vitest';

import { AsyncEchoFixture } from '../fixtures/misc/AsyncEchoFixture.js';
import { CounterFixture } from '../fixtures/misc/CounterFixture.js';
import { EchoFixture } from '../fixtures/misc/EchoFixture.js';
import { FailureFixture } from '../fixtures/misc/FailureFixture.js';
import { RandomFixture } from '../fixtures/misc/RandomFixture.js';
import { makeCreateTest } from './makeCreateTest.js';

describe('makeCreateTest', async () => {
  describe('creator with no fixture', async () => {
    const createTest = makeCreateTest(() =>
      Promise.resolve({
        fixtureContext: {},
        creatorFixtures: {},
      })
    );

    const testWithStaticFixture = await createTest({
      key: 'value',
    });
    testWithStaticFixture(
      'should be able to access static fixture',
      ({ expect, key }) => {
        expect(key).toEqual('value');
      }
    );

    const testWithNoFixture = await createTest();
    testWithNoFixture('should run without issue', ({ expect }) => {
      expect(true).toBeTruthy();
    });
  });

  describe.sequential('creator with fixtures', async () => {
    const createTest = makeCreateTest(() =>
      Promise.resolve({
        fixtureContext: {},
        creatorFixtures: {
          useEcho: EchoFixture,
          useAsyncEcho: AsyncEchoFixture,
          useCounter: CounterFixture,
          useRandom: RandomFixture,
        },
      })
    );

    const testWithFixture = await createTest(({ useEcho, useAsyncEcho }) => {
      return {
        echo: useEcho('hello'),
        asyncEcho: useAsyncEcho('async hello'),
      };
    });

    testWithFixture(
      'should be able to access the suite fixture and the test fixture',
      async ({ expect, echo, useEcho, asyncEcho }) => {
        expect(echo).toEqual('hello');
        expectTypeOf(asyncEcho).toMatchTypeOf<unknown>();
        expect(asyncEcho).toEqual('async hello');

        const testEcho = useEcho('hi');
        expect(testEcho).toEqual('hi');
      }
    );

    let storedSuiteRandomValue: string;
    let storedTestRandomValue: string;
    let storedInnerRandomValue: string;

    const testWithGetSuiteFixture = await createTest(async ({ useRandom }) => {
      storedSuiteRandomValue = useRandom().get();

      return {
        suiteRandomValue: storedSuiteRandomValue,
        testRandomValue: useRandom(),
      };
    });

    testWithGetSuiteFixture(
      'should be able to access the suite fixture created inside the createTest function',
      async ({ expect, suiteRandomValue, testRandomValue, useRandom }) => {
        expect(suiteRandomValue).toEqual(storedSuiteRandomValue);
        expect(testRandomValue).not.toEqual(storedSuiteRandomValue);

        storedTestRandomValue = testRandomValue;
        storedInnerRandomValue = useRandom();
      }
    );

    testWithGetSuiteFixture(
      'should share the value of fixtures created inside the test creator',
      async ({ expect, suiteRandomValue, testRandomValue, useRandom }) => {
        expect(suiteRandomValue).toEqual(storedSuiteRandomValue);
        expect(testRandomValue).not.toEqual(storedTestRandomValue);

        const innerValue = useRandom();
        expect(innerValue).not.toEqual(storedInnerRandomValue);
      }
    );
  });
});

describe('test fixture errors behavior', async () => {
  const createTestFailure = makeCreateTest(() =>
    Promise.resolve({
      fixtureContext: {},
      creatorFixtures: {
        useFailure: FailureFixture,
      },
    })
  );

  const test = await createTestFailure(({ useFailure }) => {
    return {
      failure: useFailure({ useFailsWithReason: 'usageFails' }),
    };
  });

  test('should not fail if the suite fixture is not used', ({ expect }) => {
    expect(true).toBeTruthy();
  });

  test('should pass and trigger an error in the runner fail when using the test fixture if fixture cleanup fails', async ({
    expect,
    useFailure,
  }) => {
    const r = await useFailure({ cleanupFailsWithReason: 'expectedCleanupFailure' });
    expect(r).toEqual('success');
  });

  test.fails(
    'should fail when accessing the suite fixture',
    async ({ expect, useFailure }) => {
      await useFailure({ useFailsWithReason: 'expectedFailure' });
      expect.unreachable();
    }
  );

  test.fails(
    'should fail when using the test fixture',
    async ({ expect, useFailure }) => {
      await useFailure({ useFailsWithReason: 'expectedFailure' });
      expect.unreachable();
    }
  );

  describe.shuffle.concurrent(
    'concurrent fixture should not mess with each other',
    async () => {
      const createTestRandom = makeCreateTest(() =>
        Promise.resolve({
          fixtureContext: {},
          creatorFixtures: {
            useRandom: RandomFixture,
          },
        })
      );

      let suiteRandomValue: unknown;

      const test = await createTestRandom(({ useRandom }) => {
        suiteRandomValue = useRandom().get();

        return {
          commonRandomValue: suiteRandomValue,
          randomValue: useRandom(),
        };
      });

      const values: string[] = [];

      for (let i = 0; i < 20; i++) {
        test(`Test ${i}`, ({ expect, randomValue, commonRandomValue }) => {
          expect(values.includes(randomValue)).toBe(false);
          values.push(randomValue);
          expect(commonRandomValue).toEqual(suiteRandomValue);
        });
      }
    }
  );
});
