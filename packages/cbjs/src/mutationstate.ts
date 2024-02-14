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
import { CppMutationToken } from './binding';

/**
 * Represents the mutation token returned by the server.
 *
 * @see MutationState
 */
export interface MutationToken {
  /**
   * Generates a string representation of this mutation token.
   */
  toString(): string;

  /**
   * Generates a JSON representation of this mutation token.
   */
  toJSON(): any;
}

/**
 * Aggregates a number of {@link MutationToken}'s which have been returned by mutation
 * operations, which can then be used when performing queries.
 * This guarantees that the query includes the specified set of mutations without incurring the wait
 * associated with request_plus level consistency.
 */
export class MutationState {
  /**
   * @internal
   */
  readonly data: {
    [bucketName: string]: { [vbId: number]: CppMutationToken };
  };

  private tokenCount = 0;

  get length() {
    return this.tokenCount;
  }

  constructor(...tokens: MutationToken[]) {
    this.data = {};

    tokens.forEach((token) => this._addOne(token));
  }

  /**
   * Adds a set of tokens to this state.
   *
   * @param tokens The tokens to add.
   */
  add(...tokens: MutationToken[]): void {
    tokens.forEach((token) => this._addOne(token));
  }

  private _addOne(token: MutationToken) {
    if (!token) {
      return;
    }

    const cppToken = token as CppMutationToken;
    const tokenData = cppToken.toJSON();
    const vbId = tokenData.partition_id;
    const vbSeqNo = parseInt(tokenData.sequence_number, 10);
    const bucketName = tokenData.bucket_name;

    if (!this.data[bucketName]) {
      this.data[bucketName] = {};
    }

    if (!this.data[bucketName][vbId]) {
      this.data[bucketName][vbId] = cppToken;
      this.tokenCount++;
      return;
    }

    const existingToken = this.data[bucketName][vbId];
    const existingTokenSeqNo = parseInt(existingToken.toJSON().sequence_number, 10);
    if (existingTokenSeqNo < vbSeqNo) {
      this.data[bucketName][vbId] = cppToken;
    }

    this.tokenCount++;
  }

  /**
   * @internal
   */
  toJSON() {
    return this.data;
  }

  getTokens(): CppMutationToken[] {
    return Object.values(this.data).flatMap((b) => Object.values(b));
  }

  toString(): string {
    return `MutationState<${this.getTokens().join('; ')}>`;
  }
}
