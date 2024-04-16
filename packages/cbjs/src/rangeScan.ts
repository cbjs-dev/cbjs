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
import { DocDef } from '@cbjsdev/shared';

/**
 * Represents a search term for a RangeScan.
 *
 * @see RangeScan
 * @category Key-Value
 */
export class ScanTerm {
  /**
   * The scan term.
   *
   * @see MutationState
   */
  term: string;

  /**
   * Set to true for the scan term to be exclusive. Defaults to false (inclusive).
   */
  exclusive?: boolean;

  /**
   * @internal
   */
  constructor(term: string, exclusive?: boolean) {
    this.term = term;
    this.exclusive = exclusive;
  }
}

/**
 *
 * @internal
 */
export interface ScanType {
  /**
   * Returns string representation of scan type.
   */
  getScanType(): string;
}

/**
 * A RangeScan performs a scan on a range of keys with the range specified through
 * a start and end ScanTerm.
 *
 * @category Key-Value
 */
export class RangeScan implements ScanType {
  /**
   * RangeScan start term.
   */
  start?: ScanTerm;

  /**
   * RangeScan end term.
   */
  end?: ScanTerm;

  /**
   * @internal
   */
  constructor(start?: ScanTerm, end?: ScanTerm) {
    this.start = start;
    this.end = end;
  }

  /**
   * Returns string representation of scan type.
   */
  getScanType(): string {
    return 'range_scan';
  }
}

/**
 * A SamplingScan performs a scan on a random sampling of keys with the sampling bounded by
 * a limit.
 *
 * @category Key-Value
 */
export class SamplingScan implements ScanType {
  /**
   * SamplingScan limit.
   */
  limit: number;

  /**
   * SamplingScan seed.
   */
  seed?: number;

  /**
   * @internal
   */
  constructor(limit: number, seed?: number) {
    this.limit = limit;
    this.seed = seed;
  }

  /**
   * Returns string representation of scan type.
   */
  getScanType(): string {
    return 'sampling_scan';
  }
}

/**
 * A PrefixScan scan type selects every document whose ID starts with a certain prefix.
 *
 * @category key-value
 */
export class PrefixScan<const Prefix extends string = string> implements ScanType {
  /**
   * PrefixScan prefix.
   */
  prefix: Prefix;

  /**
   * @internal
   */
  constructor(prefix: Prefix) {
    this.prefix = prefix;
  }

  /**
   * Returns string representation of scan type.
   */
  getScanType(): string {
    return 'prefix_scan';
  }
}

export type ValidateScanTerm<DocDefs extends DocDef, Term> = Term extends string
  ? `${Term}${string}` extends infer PrefixTemplate
    ? DocDefs extends unknown
      ? DocDefs['Key'] extends PrefixTemplate
        ? {
            DocDefs: DocDefs;
            Term: Term;
            PrefixTemplate: PrefixTemplate;
          }
        : never
      : never
    : never
  : never;
