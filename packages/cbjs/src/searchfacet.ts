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

/**
 * Provides the ability to specify facets for a search query.
 *
 * @category Full Text Search
 */
export class SearchFacet {
  protected _data: unknown;

  constructor(data: any) {
    if (!data) {
      data = {};
    }

    this._data = data;
  }

  toJSON(): any {
    return this._data;
  }

  static term(field: string, size: number): TermSearchFacet {
    return new TermSearchFacet(field, size);
  }

  static numeric(field: string, size: number): NumericSearchFacet {
    return new NumericSearchFacet(field, size);
  }

  static date(field: string, size: number): DateSearchFacet {
    return new DateSearchFacet(field, size);
  }
}

/**
 * Provides ability to request a term facet.
 *
 * @category Full Text Search
 */
export class TermSearchFacet extends SearchFacet {
  /**
   * @internal
   */
  constructor(field: string, size: number) {
    super({
      field: field,
      size: size,
    });
  }
}

/**
 * Provides ability to request a numeric facet.
 *
 * @category Full Text Search
 */
export class NumericSearchFacet extends SearchFacet {
  declare _data: {
    field: string;
    size: number;
    numeric_ranges: Array<{
      name: string;
      min: number | undefined;
      max: number | undefined;
    }>;
  };

  /**
   * @internal
   */
  constructor(field: string, size: number) {
    super({
      field: field,
      size: size,
      numeric_ranges: [],
    });
  }

  addRange(name: string, min?: number, max?: number): NumericSearchFacet {
    this._data.numeric_ranges.push({
      name: name,
      min: min,
      max: max,
    });
    return this;
  }
}

/**
 * Provides ability to request a date facet.
 *
 * @category Full Text Search
 */
export class DateSearchFacet extends SearchFacet {
  declare _data: {
    field: string;
    size: number;
    date_ranges: Array<{
      name: string;
      start: Date | undefined;
      end: Date | undefined;
    }>;
  };

  /**
   * @internal
   */
  constructor(field: string, size: number) {
    super({
      field: field,
      size: size,
      date_ranges: [],
    });
  }

  addRange(name: string, start?: Date, end?: Date): DateSearchFacet {
    this._data.date_ranges.push({
      name: name,
      start: start,
      end: end,
    });
    return this;
  }
}
