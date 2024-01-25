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
import { DurabilityLevelName, NonVoid, durabilityLevels } from '@cbjs/shared';
import { Buffer } from 'node:buffer';
import * as qs from 'querystring';

import { AnyCollection } from './clusterTypes';
import { DurabilityLevel } from './generaltypes';
import { toEnumMember } from './utilities_internal';

/**
 * CAS represents an opaque value which can be used to compare documents to
 * determine if a change has occurred.
 *
 * @category Key-Value
 */
export interface Cas {
  /**
   * Generates a string representation of this CAS.
   */
  toString(): string;

  /**
   * Generates a JSON representation of this CAS.
   */
  toJSON(): any;
}

/**
 * Create, parse and compare CAS objects.
 */
export class CouchbaseCas implements Cas {
  private raw: Buffer;

  constructor(value: string | bigint | number) {
    this.raw = CouchbaseCas.toBuffer(value);
  }

  private static toBuffer(value: string | bigint | number): Buffer {
    let binaryString = BigInt(value).toString(2);

    // Byte padding
    const padding = 8 - (binaryString.length % 8);
    binaryString = '0'.repeat(padding) + binaryString;

    const bytes = [];
    for (let i = 0; i < binaryString.length; i += 8) {
      bytes.push(parseInt(binaryString.substring(i, i + 8), 2));
    }

    return Buffer.from(bytes.reverse());
  }

  public static from(value: string | bigint | number) {
    return new CouchbaseCas(value);
  }

  toJSON(): string {
    return this.toString();
  }

  toString(): string {
    const binaryString = Array.from(this.raw)
      .reverse()
      .map((byte) => byte.toString(2).padStart(8, '0'))
      .join('');

    return BigInt('0b' + binaryString).toString(10);
  }

  isEqual(cas: Cas | string | bigint | number) {
    return CouchbaseCas.isEqual(this, cas);
  }

  isZeroCas(): boolean {
    return CouchbaseCas.isZeroCas(this);
  }

  public static isZeroCas(cas: Cas | string | bigint | number): boolean {
    return CouchbaseCas.isEqual('0', cas);
  }

  public static isEqual(
    cas1: Cas | string | bigint | number,
    cas2: Cas | string | bigint | number
  ): boolean {
    return cas1.toString() === cas2.toString();
  }
}

/**
 * A node-style callback which receives an optional error or result.
 *
 * @category Utilities
 */
export type NodeCallback<T> = (...args: [null, T] | [Error, null]) => void;
export type VoidNodeCallback = (err: Error | null) => void;

/**
 * @internal
 */
export class PromiseHelper {
  /**
   * @internal
   */
  static wrapAsync<T, U extends Promise<T>>(
    logicFn: () => U,
    callback?: NodeCallback<T>
  ): U;
  static wrapAsync<U extends Promise<void>>(
    logicFn: () => U,
    callback?: VoidNodeCallback
  ): U;
  static wrapAsync<T, U extends Promise<T>>(
    logicFn: () => U,
    callback?: (err: Error | null, res: T | null) => T
  ): U {
    // If a callback in in use, we wrap the promise with a handler which
    // forwards to the callback and return undefined.  If there is no
    // callback specified.  We directly return the promise.
    const prom = logicFn();

    if (callback) {
      prom.then((res) => callback(null, res)).catch((err) => callback(err, null));
    }

    return prom;
  }

  /**
   * @internal
   */
  static wrap<T>(
    logicFn: (callback: VoidNodeCallback) => void,
    callback?: VoidNodeCallback | null
  ): Promise<T>;
  static wrap<T>(
    logicFn: (callback: NodeCallback<NonVoid<T>>) => void,
    callback?: NodeCallback<NonVoid<T>> | null
  ): Promise<T>;
  static wrap<T>(
    logicFn: (callback: (err: Error | null, res?: T | null) => void) => void,
    callback?: ((err: Error | null, res: T | null) => T) | null
  ): Promise<T> {
    const prom: Promise<T> = new Promise((resolve, reject) => {
      logicFn((err, res) => {
        if (err) {
          reject(err as Error);
        } else {
          resolve(res as T);
        }
      });
    });

    if (callback) {
      prom.then((res) => callback(null, res)).catch((err) => callback(err, null));
    }

    return prom;
  }
}

/**
 * @internal
 */
export class CompoundTimeout {
  private _start: [number, number];
  private _timeout: number | undefined;

  /**
   * @internal
   */
  constructor(timeout: number | undefined) {
    this._start = process.hrtime();
    this._timeout = timeout;
  }

  /**
   * @internal
   */
  left(): number | undefined {
    if (this._timeout === undefined) {
      return undefined;
    }

    const period = process.hrtime(this._start);

    const periodMs = period[0] * 1e3 + period[1] / 1e6;
    if (periodMs > this._timeout) {
      return 0;
    }

    return this._timeout - periodMs;
  }

  /**
   * @internal
   */
  expired(): boolean {
    const timeLeft = this.left();
    if (timeLeft === undefined) {
      return false;
    }

    return timeLeft <= 0;
  }
}

/**
 * @internal
 */
export function duraLevelToNsServerStr(
  level: DurabilityLevel | DurabilityLevelName | undefined
): DurabilityLevelName | undefined {
  if (level === undefined) {
    return undefined;
  }

  if (typeof level === 'string') {
    return level as DurabilityLevelName;
  }

  if (level === DurabilityLevel.None) {
    return 'none';
  } else if (level === DurabilityLevel.Majority) {
    return 'majority';
  } else if (level === DurabilityLevel.MajorityAndPersistOnMaster) {
    return 'majorityAndPersistActive';
  } else if (level === DurabilityLevel.PersistToMajority) {
    return 'persistToMajority';
  } else {
    throw new Error('invalid durability level specified');
  }
}

/**
 * @internal
 */
/**
 * @internal
 */
export function nsServerStrToDuraLevel(
  level: DurabilityLevelName | number | undefined
): DurabilityLevel {
  if (level === undefined) {
    return DurabilityLevel.None;
  }

  if (typeof level === 'number') {
    return toEnumMember(DurabilityLevel, level);
  }

  const entry = durabilityLevels.find((dl) => dl.name === level);

  if (entry === undefined) {
    throw new Error('invalid durability level string');
  }

  return entry.value;
}

/**
 * @internal
 */
export function cbQsStringify(
  values: { [key: string]: any },
  options?: { boolAsString?: boolean }
): string {
  const cbValues: { [key: string]: any } = {};
  for (const i in values) {
    if (values[i] === undefined) {
      // skipped
    } else if (typeof values[i] === 'boolean') {
      if (options && options.boolAsString) {
        cbValues[i] = values[i] ? 'true' : 'false';
      } else {
        cbValues[i] = values[i] ? 1 : 0;
      }
    } else {
      cbValues[i] = values[i];
    }
  }
  return qs.stringify(cbValues);
}

export function getDocId(collection: AnyCollection, key: string) {
  return {
    bucket: collection.scope.bucket.name,
    scope: collection.scope.name || '_default',
    collection: collection.name || '_default',
    key: key,
  };
}
