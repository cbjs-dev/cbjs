/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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
import { inspect } from 'util';
import { beforeAll, describe, vi } from 'vitest';

import { ParsingFailureError } from '@cbjsdev/cbjs';
import { invariant, quoteIdentifier, waitFor } from '@cbjsdev/shared';
import { createCouchbaseTest, getDefaultServerTestContext } from '@cbjsdev/vitest';

const docs = [
  {
    id: 10,
    type: 'airline',
    name: '40-Mile Air',
    iata: 'Q5',
    icao: 'MLA',
    callsign: 'MILE-AIR',
    country: 'United States',
  },
  {
    id: 10123,
    type: 'airline',
    name: 'Texas Wings',
    iata: 'TQ',
    icao: 'TXW',
    callsign: 'TXW',
    country: 'UnitedStates',
  },
  {
    id: 10226,
    type: 'airline',
    name: 'Atifly',
    iata: 'A1',
    icao: 'A1F',
    callsign: 'atifly',
    country: 'United States',
  },
  {
    id: 10642,
    type: 'airline',
    name: 'Jc royal.britannica',
    iata: null,
    icao: 'JRB',
    callsign: null,
    country: 'United Kingdom',
  },
  {
    id: 10748,
    type: 'airline',
    name: 'Locair',
    iata: 'ZQ',
    icao: 'LOC',
    callsign: 'LOCAIR',
    country: 'United States',
  },
  {
    id: 10765,
    type: 'airline',
    name: 'SeaPort Airlines',
    iata: 'K5',
    icao: 'SQH',
    callsign: 'SASQUATCH',
    country: 'United States',
  },
  {
    id: 109,
    type: 'airline',
    name: 'Alaska Central Express',
    iata: 'KO',
    icao: 'AER',
    callsign: 'ACE AIR',
    country: 'United States',
  },
  {
    id: 112,
    type: 'airline',
    name: 'Astraeus',
    iata: '5W',
    icao: 'AEU',
    callsign: 'FLYSTAR',
    country: 'United Kingdom',
  },
  {
    id: 1191,
    type: 'airline',
    name: 'Air Austral',
    iata: 'UU',
    icao: 'REU',
    callsign: 'REUNION',
    country: 'France',
  },
  {
    id: 1203,
    type: 'airline',
    name: 'Airlinair',
    iata: 'A5',
    icao: 'RLA',
    callsign: 'AIRLINAIR',
    country: 'France',
  },
];

describe('StreamableRowPromise', async () => {
  const serverTestContext = getDefaultServerTestContext();

  beforeAll(async () => {
    await Promise.all(
      docs.map((doc) => serverTestContext.collection.insert(`doc_${doc.id}`, doc))
    );
  });

  const test = await createCouchbaseTest(() => ({
    collectionName: serverTestContext.collection.name as string,
  }));

  test('should resolve with all the documents', async ({
    serverTestContext,
    expect,
    collectionName,
  }) => {
    const queryResult = await serverTestContext.scope.query(
      `SELECT * FROM ${quoteIdentifier(collectionName)}`
    );

    expect(queryResult.rows).toHaveLength(docs.length);
  });

  test('should reject when an error occurs', async ({ serverTestContext, expect }) => {
    await expect(
      serverTestContext.scope.query(`SELECT * FROM missingCollection`)
    ).rejects.toThrow();
  });

  test('should resolve when awaited after the first row has been collected', async ({
    serverTestContext,
    expect,
    collectionName,
  }) => {
    const rowParser = vi.fn((row: string) => JSON.parse(row));

    const queryResult = serverTestContext.scope.query(
      `SELECT * FROM ${quoteIdentifier(collectionName)}`,
      {
        queryResultParser: rowParser,
      }
    );

    await waitFor(() => expect(rowParser).toHaveBeenCalled());

    const { rows } = await queryResult;

    expect(rows).toHaveLength(docs.length);
  });

  test('should throw when awaited after an error has been thrown', async ({
    serverTestContext,
    expect,
  }) => {
    const queryResult = serverTestContext.scope.query(`SELECT * FROM missingCollection`);
    await waitFor(() => expect(inspect(queryResult).includes('rejected')));
    await expect(queryResult).rejects.toThrow();
  });

  test('should process rows via event emitter', async ({
    serverTestContext,
    expect,
    collectionName,
  }) => {
    const queryResult = serverTestContext.scope.query(
      `SELECT * FROM ${quoteIdentifier(collectionName)}`
    );

    const rowListenerMock = vi.fn();
    const metaListenerMock = vi.fn();
    const endListenerMock = vi.fn();

    void queryResult.on('row', rowListenerMock);
    void queryResult.on('meta', metaListenerMock);
    void queryResult.on('end', endListenerMock);

    await waitFor(
      () => {
        expect(endListenerMock).toHaveBeenCalledOnce();
        expect(metaListenerMock).toHaveBeenCalledOnce();
        expect(rowListenerMock).toHaveBeenCalledTimes(docs.length);
      },
      { timeout: 5000 }
    );
  });

  test.fails(
    'should timeout if the listener is added after all the rows have been retrieved',
    { timeout: 3_000 },
    async ({ serverTestContext, expect, collectionName }) => {
      const rowParser = vi.fn((row: string) => JSON.parse(row));

      const queryResult = serverTestContext.scope.query(
        `SELECT * FROM ${quoteIdentifier(collectionName)}`,
        { queryResultParser: rowParser }
      );

      await waitFor(() => expect(rowParser).toHaveBeenCalledTimes(docs.length));

      await new Promise<void>((resolve) => {
        void queryResult.on('end', resolve);
      });
    }
  );

  test.fails(
    'should timeout if the listener is added after an error has been thrown',
    { timeout: 3_000 },
    async ({ serverTestContext, expect, collectionName }) => {
      const rowParser = vi.fn(() => {
        throw new Error();
      });

      const queryResult = serverTestContext.scope.query(
        `SELECT * FROM ${quoteIdentifier(collectionName)}`,
        { queryResultParser: rowParser }
      );

      await waitFor(() => expect(rowParser).toHaveBeenCalledOnce());

      await new Promise<void>((resolve) => {
        void queryResult.on('end', resolve);
      });
    }
  );

  test.fails(
    'should trigger the error event when one is received',
    async ({ serverTestContext, expect }) => {
      expect.hasAssertions();

      const queryResult = serverTestContext.scope.query(`SELECT * FROM 42`);

      await new Promise<void>((resolve) => {
        void queryResult.on('error', (err) => {
          expect(err).toBeInstanceOf(ParsingFailureError);
          resolve();
        });
      });
    }
  );

  test('should throw when awaited after a row listener has been added', async ({
    serverTestContext,
    expect,
    collectionName,
  }) => {
    const queryResult = serverTestContext.scope.query(
      `SELECT * FROM ${quoteIdentifier(collectionName)}`
    );

    void queryResult.on('row', () => {
      // Process row
    });

    try {
      await queryResult;
      expect.fail('awaiting the promise should throw');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      invariant(err instanceof Error);
      expect(err.message).toContain('already registered');
    }
  });

  test('should throw when awaited after an error listener has been added', async ({
    serverTestContext,
    expect,
  }) => {
    const queryResult = serverTestContext.scope.query(`SELECT * FROM missingCollection`);

    void queryResult.on('error', () => {
      // Process row
    });

    try {
      await queryResult;
      expect.fail('awaiting the promise should throw');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      invariant(err instanceof Error);
      expect(err.message).toContain('already registered');
    }
  });
});
