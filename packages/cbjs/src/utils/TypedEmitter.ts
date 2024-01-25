/*
 * Copyright (c) 2024-Present Jonathan MASSUCHETTI.
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

export type EventKey<T extends EventMap> = string & keyof T;
export type EventListener<T extends ReadonlyArray<any>> = (...params: T) => void;

export type EventMap = Record<string, EventListener<ReadonlyArray<any>>>;

export interface TypedEmitter<T extends EventMap> extends EventEmitter {
  eventNames(): (string | symbol)[];

  getMaxListeners(): number;
  setMaxListeners(n: number): this;

  on<K extends EventKey<T>>(eventName: K, fn: T[K]): this;
  off<K extends EventKey<T>>(eventName: K, fn: T[K]): this;
  once<K extends EventKey<T>>(eventName: K, fn: T[K]): this;

  addListener<K extends EventKey<T>>(eventName: K, fn: T[K]): this;
  prependListener<K extends EventKey<T>>(eventName: K, fn: T[K]): this;
  prependOnceListener<K extends EventKey<T>>(eventName: K, fn: T[K]): this;
  removeListener<K extends EventKey<T>>(eventName: K, fn: T[K]): this;
  removeAllListeners<K extends EventKey<T>>(eventName?: K): this;

  emit<K extends EventKey<T>>(eventName: K, ...args: Parameters<T[K]>): boolean;

  listenerCount<K extends EventKey<T>>(eventName: K): number;
  listeners<K extends EventKey<T>>(eventName: K): T[K][];
  rawListeners<K extends EventKey<T>>(eventName: K): T[K][];
}
