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
import { describe, test } from 'vitest';

import { getQueryKeyspaces } from './getQueryKeyspaces.js';

describe('getQueryKeyspaces', () => {
  test('should trim quoted identifiers', ({ expect }) => {
    expect(getQueryKeyspaces('SELECT title FROM `foo`')).toEqual([
      {
        namespace: undefined,
        keyspaceParts: ['foo'],
        keyspacePosition: [18, 23],
      },
    ]);
  });

  describe('select', () => {
    test('from bucket', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT title FROM foo')).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo'],
          keyspacePosition: [18, 21],
        },
      ]);
    });

    test('from namespaced bucket', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT * FROM default:foo')).toEqual([
        {
          namespace: 'default',
          keyspaceParts: ['foo'],
          keyspacePosition: [22, 25],
        },
      ]);
    });

    test('from system bucket', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT * FROM system:indexes')).toEqual([
        {
          namespace: 'system',
          keyspaceParts: ['indexes'],
          keyspacePosition: [21, 28],
        },
      ]);
    });

    test('from collection', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT title FROM foo.bar.baz')).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo', 'bar', 'baz'],
          keyspacePosition: [18, 29],
        },
      ]);
    });

    test('from namespaced collection', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT title FROM default:foo.bar.baz')).toEqual([
        {
          namespace: 'default',
          keyspaceParts: ['foo', 'bar', 'baz'],
          keyspacePosition: [26, 37],
        },
      ]);
    });

    test('from collection as', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT b.title FROM foo.bar.baz as b')).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo', 'bar', 'baz'],
          keyspacePosition: [20, 31],
        },
      ]);
    });

    test('from subquery', ({ expect }) => {
      expect(
        getQueryKeyspaces('SELECT b.title FROM (SELECT title FROM foo.bar.baz) as b')
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo', 'bar', 'baz'],
          keyspacePosition: [39, 50],
        },
      ]);
    });

    test('from subquery subquery', ({ expect }) => {
      expect(
        getQueryKeyspaces(
          'SELECT b.title FROM (SELECT title FROM (SELECT title FROM foo.bar.baz)) as b'
        )
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo', 'bar', 'baz'],
          keyspacePosition: [58, 69],
        },
      ]);
    });
  });

  describe('update', () => {
    test('collection', ({ expect }) => {
      expect(getQueryKeyspaces('UPDATE foo.bar.baz as b SET b.title = "meh"')).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo', 'bar', 'baz'],
          keyspacePosition: [7, 18],
        },
      ]);
    });

    test('namespaced collection', ({ expect }) => {
      expect(
        getQueryKeyspaces('UPDATE default:foo.bar.baz as b SET b.title = "meh"')
      ).toEqual([
        {
          namespace: 'default',
          keyspaceParts: ['foo', 'bar', 'baz'],
          keyspacePosition: [15, 26],
        },
      ]);
    });
  });

  describe('insert', () => {
    test('bucket', ({ expect }) => {
      expect(getQueryKeyspaces('INSERT INTO foo as b VALUES("a", "b", "c")')).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo'],
          keyspacePosition: [12, 15],
        },
      ]);
    });

    test('collection', ({ expect }) => {
      expect(
        getQueryKeyspaces('INSERT INTO foo.bar.baz as b VALUES("a", "b", "c")')
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo', 'bar', 'baz'],
          keyspacePosition: [12, 23],
        },
      ]);
    });

    test('namespaced collection', ({ expect }) => {
      expect(
        getQueryKeyspaces('INSERT INTO default:foo.bar.baz as b VALUES("a", "b", "c")')
      ).toEqual([
        {
          namespace: 'default',
          keyspaceParts: ['foo', 'bar', 'baz'],
          keyspacePosition: [20, 31],
        },
      ]);
    });

    test('collection from query', ({ expect }) => {
      expect(
        // prettier-ignore
        getQueryKeyspaces(`INSERT INTO a.b.c dest (KEY UUID(), VALUE title) SELECT title FROM d.e.f src;`)
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['a', 'b', 'c'],
          keyspacePosition: [12, 17],
        },
        {
          namespace: undefined,
          keyspaceParts: ['d', 'e', 'f'],
          keyspacePosition: [67, 72],
        },
      ]);
    });
  });

  describe('merge', () => {
    test('bucket using json', ({ expect }) => {
      expect(
        getQueryKeyspaces(`
      MERGE INTO airport AS target
      USING [
        {"iata":"DSA", "name": "Doncaster Sheffield Airport"},
        {"iata":"VLY", "name": "Anglesey Airport / Maes Awyr Môn"}
      ] AS source
      ON target.faa = source.iata
      WHEN MATCHED THEN
        UPDATE SET target.old_name = target.airportname,
                   target.airportname = source.name,
                   target.updated = true
      WHEN NOT MATCHED THEN
        INSERT (KEY UUID(),
                VALUE {"faa": source.iata,
                       "airportname": source.name,
                       "type": "airport",
                       "inserted": true} )
      RETURNING *;
      `)
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['airport'],
          keyspacePosition: [18, 25],
        },
      ]);
    });

    test('collection using json', ({ expect }) => {
      expect(
        getQueryKeyspaces(`
      MERGE INTO a.b.c AS target
      USING [
        {"iata":"DSA", "name": "Doncaster Sheffield Airport"},
        {"iata":"VLY", "name": "Anglesey Airport / Maes Awyr Môn"}
      ] AS source
      ON target.faa = source.iata
      WHEN MATCHED THEN
        UPDATE SET target.old_name = target.airportname,
                   target.airportname = source.name,
                   target.updated = true
      WHEN NOT MATCHED THEN
        INSERT (KEY UUID(),
                VALUE {"faa": source.iata,
                       "airportname": source.name,
                       "type": "airport",
                       "inserted": true} )
      RETURNING *;
      `)
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['a', 'b', 'c'],
          keyspacePosition: [18, 23],
        },
      ]);
    });

    test('namespaced collection using json', ({ expect }) => {
      expect(
        getQueryKeyspaces(`
      MERGE INTO default:a.b.c AS target
      USING [
        {"iata":"DSA", "name": "Doncaster Sheffield Airport"},
        {"iata":"VLY", "name": "Anglesey Airport / Maes Awyr Môn"}
      ] AS source
      ON target.faa = source.iata
      WHEN MATCHED THEN
        UPDATE SET target.old_name = target.airportname,
                   target.airportname = source.name,
                   target.updated = true
      WHEN NOT MATCHED THEN
        INSERT (KEY UUID(),
                VALUE {"faa": source.iata,
                       "airportname": source.name,
                       "type": "airport",
                       "inserted": true} )
      RETURNING *;
      `)
      ).toEqual([
        {
          namespace: 'default',
          keyspaceParts: ['a', 'b', 'c'],
          keyspacePosition: [26, 31],
        },
      ]);
    });

    test('bucket using bucket', ({ expect }) => {
      expect(
        getQueryKeyspaces(`
        MERGE INTO route
        USING airport
        ON route.sourceairport = airport.faa
        WHEN MATCHED THEN UPDATE
          SET route.old_equipment = route.equipment,
              route.equipment = "797",
              route.updated = true
          WHERE airport.country = "France"
            AND route.airline = "BA"
            AND CONTAINS(route.equipment, "319")
        WHEN MATCHED THEN DELETE
          WHERE airport.country = "France"
            AND route.airline = "BA"
            AND CONTAINS(route.equipment, "757")
        RETURNING route.old_equipment, route.equipment, airport.faa;
        `)
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['route'],
          keyspacePosition: [20, 25],
        },
        {
          namespace: undefined,
          keyspaceParts: ['airport'],
          keyspacePosition: [40, 47],
        },
      ]);
    });

    test('collection using collection', ({ expect }) => {
      expect(
        getQueryKeyspaces(`
        MERGE INTO a.b.c route
        USING d.e.f airport
        ON route.sourceairport = airport.faa
        WHEN MATCHED THEN UPDATE
          SET route.old_equipment = route.equipment,
              route.equipment = "797",
              route.updated = true
          WHERE airport.country = "France"
            AND route.airline = "BA"
            AND CONTAINS(route.equipment, "319")
        WHEN MATCHED THEN DELETE
          WHERE airport.country = "France"
            AND route.airline = "BA"
            AND CONTAINS(route.equipment, "757")
        RETURNING route.old_equipment, route.equipment, airport.faa;
        `)
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['a', 'b', 'c'],
          keyspacePosition: [20, 25],
        },
        {
          namespace: undefined,
          keyspaceParts: ['d', 'e', 'f'],
          keyspacePosition: [46, 51],
        },
      ]);
    });
  });

  describe('index', () => {
    test('bucket level primary index', ({ expect }) => {
      expect(
        getQueryKeyspaces('CREATE PRIMARY INDEX `#primary` ON `ci`.`_system`.`_query`')
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['ci', '_system', '_query'],
          keyspacePosition: [35, 58],
        },
      ]);
    });
  });

  test('collection level secondary index', ({ expect }) => {
    expect(
      getQueryKeyspaces('CREATE INDEX travel_cxname ON airport(LOWER(name), id);')
    ).toEqual([
      {
        namespace: undefined,
        keyspaceParts: ['airport'],
        keyspacePosition: [35, 58],
      },
    ]);
  });
});
