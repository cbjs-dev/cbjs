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
import { AnyDocDef, If } from '@cbjsdev/shared';

import { LookupInResultEntries } from './clusterTypes/kv/lookup/lookupIn.types.js';
import { MutateInResultEntries } from './clusterTypes/kv/mutation/mutateIn.types.js';
import { MutationToken } from './mutationstate.js';
import { Cas } from './utilities.js';

/**
 * Contains the results of a Get operation.
 *
 * @category Key-Value
 */
export class GetResult<T = any, WithExpiry extends boolean = boolean> {
  /**
   * The content of the document.
   */
  content: T;

  /**
   * The CAS of the document.
   */
  cas: Cas;

  /**
   * The expiry of the document, if it was requested.
   * A value of `0` means the document has no expiration time.
   *
   * @see GetOptions.withExpiry
   */
  expiryTime: If<WithExpiry, number, undefined>;

  /**
   * @internal
   */
  constructor(data: {
    content: T;
    cas: Cas;
    expiryTime?: If<WithExpiry, number, undefined>;
  }) {
    this.content = data.content;
    this.cas = data.cas;
    this.expiryTime = data.expiryTime as If<WithExpiry, number, undefined>;
  }

  /**
   * BUG(JSCBC-784): This previously held the content of the document.
   *
   * @deprecated Use {@link GetResult.content} instead.
   */
  get value(): any {
    return this.content;
  }
  set value(v: any) {
    this.content = v;
  }

  /**
   * BUG(JSCBC-873): This was incorrectly named at release.
   *
   * @deprecated Use {@link GetResult.expiryTime} instead.
   */
  get expiry(): If<WithExpiry, number, undefined> {
    return this.expiryTime;
  }
}

/**
 * Contains the results of a Range or Sampling Scan operation.
 *
 * @category Key-Value
 */
export class ScanResult<Def extends AnyDocDef = AnyDocDef> {
  /**
   * The ID of the document.
   */
  id: Def['Key'];

  /**
   * The content of the document.
   */
  content?: Def['Body'];

  /**
   * The CAS of the document.
   */
  cas?: Cas;

  /**
   * The expiry of the document, if it was requested.
   *
   * @see GetOptions.withExpiry
   */
  expiryTime?: number;

  /**
   * @internal
   */
  constructor(data: {
    id: Def['Key'];
    content?: Def['Body'];
    cas?: Cas;
    expiryTime?: number;
  }) {
    this.id = data.id;
    this.content = data.content;
    this.cas = data.cas;
    this.expiryTime = data.expiryTime;
  }
}

/**
 * Contains the results of an exists operation.
 *
 * @category Key-Value
 */
export class ExistsResult {
  /**
   * Indicates whether the document existed or not.
   */
  exists: boolean;

  /**
   * The CAS of the document.
   */
  cas: Cas | undefined;

  /**
   * @internal
   */
  constructor(data: ExistsResult) {
    this.exists = data.exists;
    this.cas = data.cas;
  }
}

/**
 * Contains the results of a mutate operation.
 *
 * @category Key-Value
 */
export class MutationResult<Token extends MutationToken | undefined = MutationToken> {
  /**
   * The updated CAS for the document.
   */
  cas: Cas;

  /**
   * The token representing the mutation performed.
   */
  token: Token;

  /**
   * @internal
   */
  constructor(data: MutationResult<Token>) {
    this.cas = data.cas;
    this.token = data.token;
  }
}

/**
 * Contains the results of a get from replica operation.
 *
 * @category Key-Value
 */
export class GetReplicaResult<T = any> {
  /**
   * The content of the document, as it existed on the replica.
   */
  content: T;

  /**
   * The cas of the document, as it is known by the replica.
   */
  cas: Cas;

  /**
   * Indicates whether this result came from a replica or the primary.
   */
  isReplica: boolean;

  /**
   * @internal
   */
  constructor(data: { content: T; cas: Cas; isReplica: boolean }) {
    this.content = data.content;
    this.cas = data.cas;
    this.isReplica = data.isReplica;
  }
}

/**
 * Contains the results of a specific sub-operation within a lookup-in operation.
 *
 * @category Key-Value
 */
export class LookupInResultEntry<Value = any, Err extends Error | null = Error | null> {
  /**
   * The error, if any, which occurred when attempting to perform this sub-operation.
   */
  error: Err;

  /**
   * The value returned by the sub-operation.
   */
  value: Value;

  /**
   * @internal
   */
  constructor(data: { value: Value; error: Err }) {
    this.error = data.error;
    this.value = data.value;
  }
}

/**
 * Contains the results of a lookup-in operation.
 *
 * @category Key-Value
 */
export class LookupInResult<
  Results extends ReadonlyArray<unknown> = any[],
  ThrowOnSpecError extends boolean = false,
> {
  /**
   * A list of result entries for each sub-operation performed.
   */
  content: LookupInResultEntries<Results, ThrowOnSpecError>;
  /**
   * The cas of the document.
   */
  cas: Cas;

  /**
   * @internal
   */
  constructor(data: {
    content: LookupInResultEntries<Results, ThrowOnSpecError>;
    cas: Cas;
  }) {
    this.content = data.content;
    this.cas = data.cas;
  }

  /**
   * BUG(JSCBC-730): Previously held the content of the document.
   *
   * @deprecated Use {@link LookupInResult.content} instead.
   */
  get results(): LookupInResultEntries<Results, ThrowOnSpecError> {
    return this.content;
  }
  set results(v: LookupInResultEntries<Results, ThrowOnSpecError>) {
    this.content = v;
  }
}

/**
 * Contains the results of a lookup-in replica operation.
 *
 * @category Key-Value
 */
export class LookupInReplicaResult<
  Results extends ReadonlyArray<any> = any[],
  ThrowOnSpecError extends boolean = false,
> {
  /**
   * A list of result entries for each sub-operation performed.
   */
  content: LookupInResultEntries<Results, ThrowOnSpecError>;
  /**
   * The cas of the document.
   */
  cas: Cas;

  /**
   * Indicates whether this result came from a replica or the primary.
   */
  isReplica: boolean;

  constructor(data: {
    content: LookupInResultEntries<Results, ThrowOnSpecError>;
    cas: Cas;
    isReplica: boolean;
  }) {
    this.content = data.content;
    this.cas = data.cas;
    this.isReplica = data.isReplica;
  }
}

/**
 * Contains the results of a specific sub-operation within a mutate-in operation.
 *
 * @category Key-Value
 */
export class MutateInResultEntry<Result = number | undefined> {
  /**
   * The resulting value after the completion of the sub-operation.  This namely
   * returned in the case of a counter operation (increment/decrement) and is not
   * included for general operations.
   */
  value: Result;

  /**
   * @internal
   */
  constructor(data: MutateInResultEntry<Result>) {
    this.value = data.value;
  }
}

/**
 * Contains the results of a mutate-in operation.
 *
 * @category Key-Value
 */
export class MutateInResult<Results = ReadonlyArray<number | undefined>> {
  /**
   * A list of result entries for each sub-operation performed.
   */
  content: MutateInResultEntries<Results>;

  /**
   * The updated CAS for the document.
   */
  cas: Cas;

  /**
   * The token representing the mutation performed.
   */
  token: MutationToken;

  /**
   * @internal
   */
  constructor(data: {
    content: MutateInResultEntries<Results>;
    cas: Cas;
    token: MutationToken;
  }) {
    this.content = data.content;
    this.cas = data.cas;
    this.token = data.token;
  }
}

/**
 * Contains the results of a counter operation (binary increment/decrement).
 *
 * @category Key-Value
 */
export class CounterResult {
  /**
   * The new value of the document after the operation completed.
   */
  value: number;

  /**
   * The updated CAS for the document.
   */
  cas: Cas;

  /**
   * The token representing the mutation performed.
   */
  token?: MutationToken;

  /**
   * @internal
   */
  constructor(data: CounterResult) {
    this.value = data.value;
    this.cas = data.cas;
    this.token = data.token;
  }
}
