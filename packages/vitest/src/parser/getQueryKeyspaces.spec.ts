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
      },
    ]);
  });

  describe('select', () => {
    test('from bucket', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT title FROM foo')).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo'],
        },
      ]);
    });

    test('from namespaced bucket', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT * FROM default:foo')).toEqual([
        {
          namespace: 'default',
          keyspaceParts: ['foo'],
        },
      ]);
    });

    test('from system bucket', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT * FROM system:indexes')).toEqual([
        {
          namespace: 'system',
          keyspaceParts: ['indexes'],
        },
      ]);
    });

    test('from collection', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT title FROM foo.bar.baz')).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo', 'bar', 'baz'],
        },
      ]);
    });

    test('from namespaced collection', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT * FROM default:foo.bar.baz')).toEqual([
        {
          namespace: 'default',
          keyspaceParts: ['foo', 'bar', 'baz'],
        },
      ]);
    });

    test('from collection as', ({ expect }) => {
      expect(getQueryKeyspaces('SELECT b.title FROM foo.bar.baz as b')).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['foo', 'bar', 'baz'],
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
        },
      ]);
    });

    test('collection from query', ({ expect }) => {
      expect(
        getQueryKeyspaces(`
        INSERT INTO a.b.c dest (KEY UUID(), VALUE title) SELECT title FROM d.e.f src;
        `)
      ).toEqual([
        {
          namespace: undefined,
          keyspaceParts: ['a', 'b', 'c'],
        },
        {
          namespace: undefined,
          keyspaceParts: ['d', 'e', 'f'],
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
        },
        {
          namespace: undefined,
          keyspaceParts: ['airport'],
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
        },
        {
          namespace: undefined,
          keyspaceParts: ['d', 'e', 'f'],
        },
      ]);
    });
  });
});
