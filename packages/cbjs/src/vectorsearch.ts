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
import { InvalidArgumentError } from './errors';

/**
 * Specifies how multiple vector searches are combined.
 *
 * Uncommitted: This API is subject to change in the future.
 *
 * @category Full Text Search
 */
export enum VectorQueryCombination {
  /**
   * Indicates that multiple vector queries should be combined with logical AND.
   */
  AND = 'and',

  /**
   * Indicates that multiple vector queries should be combined with logical OR.
   */
  OR = 'or',
}

/**
 * Uncommitted: This API is subject to change in the future.
 *
 * @category Full Text Search
 */
export interface VectorSearchOptions {
  /**
   * Specifies how multiple vector queries should be combined.
   */
  vectorQueryCombination?: VectorQueryCombination;
}

/**
 * Represents a vector query.
 *
 * Uncommitted: This API is subject to change in the future.
 *
 * @category Full Text Search
 */
export class VectorQuery {
  private _fieldName: string;
  private _vector: number[];
  private _numCandidates: number | undefined;
  private _boost: number | undefined;

  constructor(fieldName: string, vector: number[]) {
    this._fieldName = fieldName;
    if (!Array.isArray(vector) || vector.length == 0) {
      throw new InvalidArgumentError(
        'Provided vector must be an array and cannot be empty.'
      );
    }
    this._vector = vector;
  }

  /**
   * @internal
   */
  toJSON() {
    const output: {
      field: string;
      vector: number[];
      k: number;
      boost?: number;
    } = {
      field: this._fieldName,
      vector: this._vector,
      k: this._numCandidates ?? 3,
    };

    if (this._boost) {
      output.boost = this._boost;
    }

    return output;
  }

  /**
   * Adds boost option to vector query.
   *
   * Uncommitted: This API is subject to change in the future.
   *
   * @param boost A floating point value.
   */
  boost(boost: number): VectorQuery {
    this._boost = boost;
    return this;
  }

  /**
   * Adds numCandidates option to vector query. Value must be >= 1.
   *
   * Uncommitted: This API is subject to change in the future.
   *
   * @param numCandidates An integer value.
   */
  numCandidates(numCandidates: number): VectorQuery {
    if (numCandidates < 1) {
      throw new InvalidArgumentError('Provided value for numCandidates must be >= 1.');
    }
    this._numCandidates = numCandidates;
    return this;
  }

  /**
   * Creates a vector query.
   *
   * Uncommitted: This API is subject to change in the future.
   *
   * @param fieldName The name of the field in the JSON document that holds the vector.
   * @param vector List of floating point values that represent the vector.
   */
  static create(fieldName: string, vector: number[]): VectorQuery {
    return new VectorQuery(fieldName, vector);
  }
}

/**
 * Represents a vector search.
 *
 * Uncommitted: This API is subject to change in the future.
 *
 * @category Full Text Search
 */
export class VectorSearch {
  private _queries: VectorQuery[];
  private _options: VectorSearchOptions | undefined;

  constructor(queries: [VectorQuery, ...VectorQuery[]], options?: VectorSearchOptions) {
    if (!Array.isArray(queries) || queries.length == 0) {
      throw new InvalidArgumentError(
        'Provided queries must be an array and cannot be empty.'
      );
    }

    if (!queries.every((q) => q instanceof VectorQuery)) {
      throw new InvalidArgumentError('All provided queries must be a VectorQuery.');
    }

    this._queries = queries;
    this._options = options;
  }

  /**
   * @internal
   */
  get queries(): VectorQuery[] {
    return this._queries;
  }

  /**
   * @internal
   */
  get options(): VectorSearchOptions | undefined {
    return this._options;
  }

  /**
   * Creates a vector search.
   *
   * Uncommitted: This API is subject to change in the future.
   *
   * @param query A vectory query that should be a part of the vector search.
   */
  static fromVectorQuery(query: VectorQuery): VectorSearch {
    return new VectorSearch([query]);
  }
}
