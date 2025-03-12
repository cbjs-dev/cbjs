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
import { EventEmitter } from 'events';

import { RecordEntry } from '@cbjsdev/shared';

import type { EventKey, EventMap, TypedEmitter } from './utils/TypedEmitter.js';

/**
 * @internal
 */
type PromisifyEmitter<EM extends EventMap> = {
  on<Event extends keyof EventMap>(eventName: Event, listener: EM[Event]): void;
};

/**
 * @internal
 */
type PromisifyFunc<T, EM extends EventMap> = (
  emitter: PromisifyEmitter<EM>,
  resolve: (result: T) => void,
  reject: (err: Error) => void
) => void;

/**
 * @internal
 */
export class StreamablePromise<T, EM extends EventMap>
  extends (EventEmitter as unknown as {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new <TEM extends EventMap>(): TypedEmitter<TEM>;
  })<EM>
  implements Promise<T>
{
  private _promise: Promise<T> | null = null;
  private _promiseOns: RecordEntry<EM>[];

  // private catchFn: [undefined | ((err: unknown) => void)];

  /**
   * @internal
   */
  constructor(promisefyFn: PromisifyFunc<T, EM>) {
    super();

    this._promiseOns = [];
    this._promise = new Promise((resolve, reject) => {
      promisefyFn(
        {
          on: <EventName extends EventKey<EM>>(
            eventName: EventName,
            listener: EM[EventName]
          ) => {
            this._promiseOns.push([eventName, listener]);
            void super.on(eventName, listener);
          },
        },
        resolve,
        reject
      );
    });
  }

  private get promise(): Promise<T> {
    if (!this._promise) {
      throw new Error('Cannot await a promise that is already registered for events');
    }
    return this._promise;
  }

  private _depromisify() {
    this._promiseOns.forEach((e: [any, any]) => void this.off(...e));

    this._promise = null;
  }

  override addListener<EventName extends EventKey<EM>>(
    eventName: EventName,
    listener: EM[EventName]
  ) {
    this._depromisify();
    return super.on(eventName, listener);
  }

  override on<EventName extends EventKey<EM>>(
    eventName: EventName,
    listener: EM[EventName]
  ): this {
    this._depromisify();
    return super.on(eventName, listener);
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then<TResult1, TResult2>(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult> {
    return this.promise.catch<TResult>(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onfinally);
  }

  /**
   * @internal
   */
  get [Symbol.toStringTag](): string {
    return (Promise as never)[Symbol.toStringTag];
  }
}

/**
 * Provides the ability to be used as either a promise or an event emitter.
 * Enabling an application to easily retrieve all results using async/await or enabling
 * streaming of results by listening for the row and meta events.
 */
export class StreamableRowPromise<T, TRow, TMeta> extends StreamablePromise<
  T,
  {
    row: (row: TRow) => void;
    meta: (meta: TMeta) => void;
    error: (err: Error) => void;
    end: () => void;
  }
> {
  constructor(fn: (rows: TRow[], meta: TMeta) => T) {
    super((emitter, resolve, reject) => {
      let err: Error | undefined;
      const rows: TRow[] = [];
      let meta: TMeta | undefined;

      void emitter.on('row', (r) => rows.push(r));
      void emitter.on('meta', (m) => (meta = m));
      void emitter.on('error', (e) => (err = e));
      void emitter.on('end', () => {
        if (err) {
          return reject(err);
        }

        resolve(fn(rows, meta as TMeta));
      });
    });
  }
}

/**
 * Provides the ability to be used as either a promise or an event emitter.
 * Enabling an application to easily retrieve all replicas using async/await or enabling
 * streaming of replicas by listening for the replica event.
 */
export class StreamableReplicasPromise<T, TRep> extends StreamablePromise<
  T,
  {
    replica: (resultFromReplica: TRep) => void;
    error: (err: Error) => void;
    end: () => void;
  }
> {
  constructor(fn: (replicas: [TRep, ...TRep[]]) => T) {
    super((emitter, resolve, reject) => {
      let err: Error | undefined;
      const replicas: TRep[] = [];

      void emitter.on('replica', (r) => replicas.push(r));
      void emitter.on('error', (e) => (err = e));
      void emitter.on('end', () => {
        if (err) {
          return reject(err);
        }

        resolve(fn(replicas as [TRep, ...TRep[]]));
      });
    });
  }
}

/**
 * Provides the ability to be used as either a promise or an event emitter.
 * Enabling an application to easily retrieve all scan results using async/await or enabling
 * streaming of scan results by listening for the result event.
 */
export class StreamableScanPromise<T, TRes> extends StreamablePromise<
  T,
  {
    result: (result: TRes) => void;
    error: (err: Error) => void;
    end: () => void;
  }
> {
  private _cancelRequested: boolean;

  constructor(fn: (results: TRes[]) => T) {
    super((emitter, resolve, reject) => {
      let err: Error | undefined;
      const results: TRes[] = [];

      void emitter.on('result', (r) => results.push(r));
      void emitter.on('error', (e) => (err = e));
      void emitter.on('end', () => {
        if (err) {
          return reject(err);
        }

        resolve(fn(results));
      });
    });
    this._cancelRequested = false;
  }

  get cancelRequested(): boolean {
    return this._cancelRequested;
  }

  cancelStreaming(): void {
    this._cancelRequested = true;
  }
}
