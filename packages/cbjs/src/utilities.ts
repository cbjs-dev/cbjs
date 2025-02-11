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
import * as qs from 'querystring';
import { ParsedUrlQueryInput } from 'querystring';

import type { Cas, DurabilityLevelName, NonVoid } from '@cbjsdev/shared';
import { CouchbaseCas, durabilityLevels } from '@cbjsdev/shared';

import type { AnyCollection } from './clusterTypes/index.js';
import { InvalidArgumentError } from './errors.js';
import { DurabilityLevel } from './generaltypes.js';
import { toEnumMember } from './utilities_internal.js';

// We re-export from here to avoid import issues from the user side.
export { type Cas, CouchbaseCas };

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
      prom.then(
        (res) => callback(null, res),
        (err: Error) => callback(err, null)
      );
    }

    return prom;
  }

  /**
   * @internal
   */
  static wrap(
    logicFn: (callback: VoidNodeCallback) => void,
    callback?: VoidNodeCallback | null
  ): Promise<void>;
  static wrap<T>(
    logicFn: (callback: NodeCallback<NonVoid<T>>) => void,
    callback?: NodeCallback<NonVoid<NoInfer<T>>> | null
  ): Promise<T>;
  static wrap<T>(
    logicFn: (callback: (err: Error | null, res?: T | null) => void) => void,
    callback?: ((err: Error | null, res: NoInfer<T> | null) => T) | null
  ): Promise<T> {
    const prom = new Promise<T>((resolve, reject) => {
      logicFn((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res as T);
      });
    });

    if (callback) {
      prom.then(
        (res) => callback(null, res),
        (err: Error) => callback(err, null)
      );
    }

    return prom;
  }
}

/**
 * @internal
 */
export class CompoundTimeout {
  protected readonly start: [number, number];
  protected readonly timeout: number;

  /**
   * @internal
   */
  constructor(timeout: number) {
    this.start = process.hrtime();
    this.timeout = timeout;
  }

  /**
   * @internal
   */
  left(): number {
    const period = process.hrtime(this.start);

    const periodMs = period[0] * 1e3 + period[1] / 1e6;
    if (periodMs > this.timeout) {
      return 0;
    }

    return this.timeout - periodMs;
  }

  /**
   * @internal
   */
  expired(): boolean {
    return this.left() <= 0;
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
  values: ParsedUrlQueryInput,
  options?: { boolAsString?: boolean }
): string {
  const cbValues: ParsedUrlQueryInput = {};
  for (const i in values) {
    const value = values[i];
    const resolvedOptions = {
      boolAsString: false,
      ...options,
    };

    if (value === undefined) continue;

    if (typeof value === 'boolean' && resolvedOptions.boolAsString) {
      cbValues[i] = values[i] ? 'true' : 'false';
      continue;
    }

    if (typeof value === 'boolean') {
      cbValues[i] = values[i] ? 1 : 0;
      continue;
    }

    cbValues[i] = values[i];
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

const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

/**
 * @internal
 */
export function expiryToTimestamp(expiry: unknown): number {
  if (typeof expiry !== 'number') {
    throw new InvalidArgumentError('Expected expiry to be a number.');
  }

  if (expiry < 0) {
    throw new InvalidArgumentError(
      `Expected expiry to be either zero (for no expiry) or greater but got ${expiry}.`
    );
  }

  if (expiry >= thirtyDaysInSeconds) {
    return expiry + Math.floor(Date.now() / 1000);
  }

  return expiry;
}
