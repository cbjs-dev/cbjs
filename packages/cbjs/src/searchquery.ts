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
import { hasOwn } from '@cbjs/shared';

/**
 * Specifies how the individual match terms should be logically concatenated.
 *
 * @experimental This API is subject to change without notice.
 * @category Full Text Search
 */
export enum MatchOperator {
  /**
   * Specifies that individual match terms are concatenated with a logical OR - this is the default if not provided.
   */
  Or = 'or',

  /**
   * Specifies that individual match terms are concatenated with a logical AND.
   */
  And = 'and',
}

/**
 * GeoPoint represents a specific coordinate on earth.  We support
 * a number of different variants of geopoints being specified.
 *
 * @category Full Text Search
 */
export type GeoPoint =
  | [longitude: number, latitude: number]
  | { lon: number; lat: number }
  | { longitude: number; latitude: number };

function normalizeGeoPoint(point: GeoPoint): [number, number] {
  if (Array.isArray(point)) {
    return point;
  }

  if (hasOwn(point, 'lon')) {
    return [point.lon, point.lat];
  }

  return [point.longitude, point.latitude];
}

/**
 * @internal
 */
function _unpackListArgs<T>(args: T[] | T[][]): T[] {
  if (Array.isArray(args[0])) {
    return args[0];
  }
  return args as T[];
}

/**
 * Provides the ability to specify the query for a search query.
 *
 * @category Full Text Search
 */
export class SearchQuery {
  protected _data: Record<string, unknown>;

  constructor(data: Record<string, unknown> = {}) {
    this._data = data;
  }

  toJSON() {
    return this._data;
  }

  /**
   * @internal
   */
  hasProp(prop: string): boolean {
    return this._data[prop] !== undefined;
  }

  static match(match: string): MatchSearchQuery {
    return new MatchSearchQuery(match);
  }

  static matchPhrase(phrase: string): MatchPhraseSearchQuery {
    return new MatchPhraseSearchQuery(phrase);
  }

  static regexp(regexp: string): RegexpSearchQuery {
    return new RegexpSearchQuery(regexp);
  }

  static queryString(query: string): QueryStringSearchQuery {
    return new QueryStringSearchQuery(query);
  }

  static numericRange(): NumericRangeSearchQuery {
    return new NumericRangeSearchQuery();
  }

  static dateRange(): DateRangeSearchQuery {
    return new DateRangeSearchQuery();
  }

  /**
   * Creates a ConjunctionSearchQuery from a set of other SearchQuery's.
   *
   * @deprecated Use the multi-argument overload instead.
   */
  static conjuncts(queries: SearchQuery[]): ConjunctionSearchQuery;

  /**
   * Creates a ConjunctionSearchQuery from a set of other SearchQuery's.
   */
  static conjuncts(...queries: SearchQuery[]): ConjunctionSearchQuery;

  /**
   * @internal
   */
  static conjuncts(...args: SearchQuery[] | SearchQuery[][]): ConjunctionSearchQuery {
    const queries = _unpackListArgs(args);
    return new ConjunctionSearchQuery(...queries);
  }

  /**
   * Creates a DisjunctionSearchQuery from a set of other SearchQuery's.
   *
   * @deprecated Use the multi-argument overload instead.
   */
  static disjuncts(queries: SearchQuery[]): DisjunctionSearchQuery;

  /**
   * Creates a DisjunctionSearchQuery from a set of other SearchQuery's.
   */
  static disjuncts(...queries: SearchQuery[]): DisjunctionSearchQuery;

  /**
   * @internal
   */
  static disjuncts(...args: SearchQuery[] | SearchQuery[][]): DisjunctionSearchQuery {
    const queries = _unpackListArgs(args);
    return new DisjunctionSearchQuery(...queries);
  }

  static boolean(): BooleanSearchQuery {
    return new BooleanSearchQuery();
  }

  static wildcard(wildcard: string): WildcardSearchQuery {
    return new WildcardSearchQuery(wildcard);
  }

  /**
   * Creates a DocIdSearchQuery from a set of document-ids.
   *
   * @deprecated Use the multi-argument overload instead.
   */
  static docIds(queries: string[]): DocIdSearchQuery;

  /**
   * Creates a DocIdSearchQuery from a set of document-ids.
   */
  static docIds(...queries: string[]): DocIdSearchQuery;

  /**
   * @internal
   */
  static docIds(...args: string[] | string[][]): DocIdSearchQuery {
    const queries = _unpackListArgs(args);
    return new DocIdSearchQuery(...queries);
  }

  static booleanField(val: boolean): BooleanFieldSearchQuery {
    return new BooleanFieldSearchQuery(val);
  }

  static term(term: string): TermSearchQuery {
    return new TermSearchQuery(term);
  }

  static phrase(terms: string[]): PhraseSearchQuery {
    return new PhraseSearchQuery(terms);
  }

  static prefix(prefix: string): PrefixSearchQuery {
    return new PrefixSearchQuery(prefix);
  }

  static matchAll(): MatchAllSearchQuery {
    return new MatchAllSearchQuery();
  }

  static matchNone(): MatchNoneSearchQuery {
    return new MatchNoneSearchQuery();
  }

  static geoDistance(lon: number, lat: number, distance: number): GeoDistanceSearchQuery {
    return new GeoDistanceSearchQuery(lon, lat, distance);
  }

  static geoBoundingBox(
    tl_lon: number,
    tl_lat: number,
    br_lon: number,
    br_lat: number
  ): GeoBoundingBoxSearchQuery {
    return new GeoBoundingBoxSearchQuery(tl_lon, tl_lat, br_lon, br_lat);
  }

  static geoPolygon(points: GeoPoint[]): GeoPolygonSearchQuery {
    return new GeoPolygonSearchQuery(points);
  }
}

/**
 * Represents a match search query.
 *
 * @category Full Text Search
 */
export class MatchSearchQuery extends SearchQuery {
  declare _data: {
    match: string;
    operator?: MatchOperator;
    analyzer?: string;
    prefix_length?: number;
    fuzziness?: number;
    field?: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor(match: string) {
    super({
      match: match,
    });
  }

  operator(op: MatchOperator): MatchSearchQuery {
    this._data.operator = op;
    return this;
  }

  field(field: string): MatchSearchQuery {
    this._data.field = field;
    return this;
  }

  analyzer(analyzer: string): MatchSearchQuery {
    this._data.analyzer = analyzer;
    return this;
  }

  prefixLength(prefixLength: number): MatchSearchQuery {
    this._data.prefix_length = prefixLength;
    return this;
  }

  fuzziness(fuzziness: number): MatchSearchQuery {
    this._data.fuzziness = fuzziness;
    return this;
  }

  boost(boost: number): MatchSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a match-phrase search query.
 *
 * @category Full Text Search
 */
export class MatchPhraseSearchQuery extends SearchQuery {
  declare _data: {
    match_phrase: string;
    analyzer?: string;
    field?: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor(phrase: string) {
    super({
      match_phrase: phrase,
    });
  }

  field(field: string): MatchPhraseSearchQuery {
    this._data.field = field;
    return this;
  }

  analyzer(analyzer: string): MatchPhraseSearchQuery {
    this._data.analyzer = analyzer;
    return this;
  }

  boost(boost: number): MatchPhraseSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a regexp search query.
 *
 * @category Full Text Search
 */
export class RegexpSearchQuery extends SearchQuery {
  declare _data: {
    regexp: string;
    field?: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor(regexp: string) {
    super({
      regexp: regexp,
    });
  }

  field(field: string): RegexpSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): RegexpSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a query-string search query.
 *
 * @category Full Text Search
 */
export class QueryStringSearchQuery extends SearchQuery {
  declare _data: {
    query: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor(query: string) {
    super({
      query: query,
    });
  }

  boost(boost: number): QueryStringSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a numeric-range search query.
 *
 * @category Full Text Search
 */
export class NumericRangeSearchQuery extends SearchQuery {
  declare _data: {
    min?: number;
    inclusive_min?: boolean;
    max?: number;
    inclusive_max?: boolean;
    field?: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor() {
    super({});
  }

  min(min: number, inclusive = true): NumericRangeSearchQuery {
    this._data.min = min;
    this._data.inclusive_min = inclusive;
    return this;
  }

  max(max: number, inclusive = false): NumericRangeSearchQuery {
    this._data.max = max;
    this._data.inclusive_max = inclusive;
    return this;
  }

  field(field: string): NumericRangeSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): NumericRangeSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a date-range search query.
 *
 * @category Full Text Search
 */
export class DateRangeSearchQuery extends SearchQuery {
  declare _data: {
    start?: string;
    inclusive_start?: boolean;
    end?: string;
    inclusive_end?: boolean;
    datetime_parser?: string;
    field?: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor() {
    super({});
  }

  start(start: Date | string, inclusive?: boolean): DateRangeSearchQuery {
    if (inclusive === undefined) {
      inclusive = true;
    }

    if (start instanceof Date) {
      this._data.start = start.toISOString();
    } else {
      this._data.start = start;
    }

    this._data.inclusive_start = inclusive;
    return this;
  }

  end(end: Date | string, inclusive?: boolean): DateRangeSearchQuery {
    if (inclusive === undefined) {
      inclusive = false;
    }

    if (end instanceof Date) {
      this._data.end = end.toISOString();
    } else {
      this._data.end = end;
    }

    this._data.inclusive_end = inclusive;
    return this;
  }

  field(field: string): DateRangeSearchQuery {
    this._data.field = field;
    return this;
  }

  dateTimeParser(parser: string): DateRangeSearchQuery {
    this._data.datetime_parser = parser;
    return this;
  }

  boost(boost: number): DateRangeSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a conjunction search query.
 *
 * @category Full Text Search
 */
export class ConjunctionSearchQuery extends SearchQuery {
  declare _data: {
    conjuncts: SearchQuery[];
    boost?: number;
  };

  /**
   * @internal
   */
  constructor(...queries: SearchQuery[]) {
    super({
      conjuncts: [],
    });

    this.and(...queries);
  }

  /**
   * Adds additional queries to this conjunction query.
   *
   * @deprecated Use the multi-argument overload instead.
   */
  and(queries: SearchQuery[]): ConjunctionSearchQuery;

  /**
   * Adds additional queries to this conjunction query.
   */
  and(...queries: SearchQuery[]): ConjunctionSearchQuery;

  /**
   * @internal
   */
  and(...args: SearchQuery[] | SearchQuery[][]): ConjunctionSearchQuery {
    const queries = _unpackListArgs(args);

    for (const item of queries) {
      this._data.conjuncts.push(item);
    }
    return this;
  }

  boost(boost: number): ConjunctionSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a disjunction search query.
 *
 * @category Full Text Search
 */
export class DisjunctionSearchQuery extends SearchQuery {
  declare _data: {
    disjuncts: SearchQuery[];
    boost?: number;
    min?: number;
  };

  /**
   * @internal
   */
  constructor(...queries: SearchQuery[]) {
    super({
      disjuncts: [],
    });

    this.or(...queries);
  }

  /**
   * Adds additional queries to this disjunction query.
   *
   * @deprecated Use the multi-argument overload instead.
   */
  or(queries: SearchQuery[]): DisjunctionSearchQuery;

  /**
   * Adds additional queries to this disjunction query.
   */
  or(...queries: SearchQuery[]): DisjunctionSearchQuery;

  /**
   * @internal
   */
  or(...args: SearchQuery[] | SearchQuery[][]): DisjunctionSearchQuery {
    const queries = _unpackListArgs(args);

    for (const item of queries) {
      this._data.disjuncts.push(item);
    }
    return this;
  }

  boost(boost: number): DisjunctionSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a boolean search query.
 *
 * @category Full Text Search
 */
export class BooleanSearchQuery extends SearchQuery {
  private _shouldMin: number | undefined;
  declare _data: {
    boost?: number;
    must?: ConjunctionSearchQuery;
    should?: DisjunctionSearchQuery;
    must_not?: DisjunctionSearchQuery;
  };

  /**
   * @internal
   */
  constructor() {
    super({});
    this._shouldMin = undefined;
  }

  must(query: ConjunctionSearchQuery): BooleanSearchQuery {
    if (!query.hasProp('conjuncts')) {
      query = new ConjunctionSearchQuery(query);
    }

    this._data.must = query;
    return this;
  }

  should(query: DisjunctionSearchQuery): BooleanSearchQuery {
    if (!query.hasProp('disjuncts')) {
      query = new DisjunctionSearchQuery(query);
    }
    this._data.should = query;
    return this;
  }

  mustNot(query: DisjunctionSearchQuery): BooleanSearchQuery {
    if (!query.hasProp('disjuncts')) {
      query = new DisjunctionSearchQuery(query);
    }
    this._data.must_not = query;
    return this;
  }

  shouldMin(shouldMin: number): BooleanSearchQuery {
    this._shouldMin = shouldMin;
    return this;
  }

  boost(boost: number): BooleanSearchQuery {
    this._data.boost = boost;
    return this;
  }

  override toJSON() {
    const result: Partial<
      Record<'should' | 'must' | 'must_not' | 'boost', number | Record<string, unknown>>
    > = {};

    if (this._data.must) result.must = this._data.must.toJSON();
    if (this._data.must_not) result.must_not = this._data.must_not.toJSON();

    if (this._data.should) {
      const shouldQueryJson = this._data.should.toJSON();
      if (this._shouldMin) shouldQueryJson.min = this._shouldMin;

      result.should = shouldQueryJson;
    }

    if (this._data.boost) {
      result.boost = this._data.boost;
    }

    return result;
  }
}

/**
 * Represents a wildcard search query.
 *
 * @category Full Text Search
 */
export class WildcardSearchQuery extends SearchQuery {
  declare _data: {
    wildcard: string;
    field?: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor(wildcard: string) {
    super({
      wildcard: wildcard,
    });
  }

  field(field: string): WildcardSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): WildcardSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a document-id search query.
 *
 * @category Full Text Search
 */
export class DocIdSearchQuery extends SearchQuery {
  declare _data: {
    ids: string[];
    field?: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor(...ids: string[]) {
    super({
      ids: [],
    });

    this.addDocIds(...ids);
  }

  /**
   * Adds additional document-id's to this query.
   *
   * @deprecated Use the multi-argument overload instead.
   */
  addDocIds(ids: string[]): DocIdSearchQuery;

  /**
   * Adds additional document-id's to this query.
   */
  addDocIds(...ids: string[]): DocIdSearchQuery;

  /**
   * @internal
   */
  addDocIds(...args: string[] | string[][]): DocIdSearchQuery {
    const ids = _unpackListArgs(args);

    for (const item of ids) {
      this._data.ids.push(item);
    }
    return this;
  }

  field(field: string): DocIdSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): DocIdSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a boolean-field search query.
 *
 * @category Full Text Search
 */
export class BooleanFieldSearchQuery extends SearchQuery {
  declare _data: {
    bool: boolean;
    boost?: number;
    field?: string;
  };

  /**
   * @internal
   */
  constructor(val: boolean) {
    super({
      bool: val,
    });
  }

  field(field: string): BooleanFieldSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): BooleanFieldSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a term search query.
 *
 * @category Full Text Search
 */
export class TermSearchQuery extends SearchQuery {
  declare _data: {
    term: string;
    boost?: number;
    field?: string;
    prefix_length?: number;
    fuzziness?: number;
  };

  /**
   * @internal
   */
  constructor(term: string) {
    super({
      term: term,
    });
  }

  field(field: string): TermSearchQuery {
    this._data.field = field;
    return this;
  }

  prefixLength(prefixLength: number): TermSearchQuery {
    this._data.prefix_length = prefixLength;
    return this;
  }

  fuzziness(fuzziness: number): TermSearchQuery {
    this._data.fuzziness = fuzziness;
    return this;
  }

  boost(boost: number): TermSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a phrase search query.
 *
 * @category Full Text Search
 */
export class PhraseSearchQuery extends SearchQuery {
  declare _data: {
    terms: string[];
    boost?: number;
    field?: string;
  };

  /**
   * @internal
   */
  constructor(terms: string[]) {
    super({
      terms: terms,
    });
  }

  field(field: string): PhraseSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): PhraseSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a prefix search query.
 *
 * @category Full Text Search
 */
export class PrefixSearchQuery extends SearchQuery {
  declare _data: {
    prefix: string;
    boost?: number;
    field?: string;
  };

  /**
   * @internal
   */
  constructor(prefix: string) {
    super({
      prefix: prefix,
    });
  }

  field(field: string): PrefixSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): PrefixSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a match-all search query.
 *
 * @category Full Text Search
 */
export class MatchAllSearchQuery extends SearchQuery {
  declare _data: {
    match_all: null;
  };

  /**
   * @internal
   */
  constructor() {
    super({
      match_all: null,
    });
  }
}

/**
 * Represents a match-none search query.
 *
 * @category Full Text Search
 */
export class MatchNoneSearchQuery extends SearchQuery {
  declare _data: {
    match_none: true;
  };

  /**
   * @internal
   */
  constructor() {
    super({
      match_none: true,
    });
  }
}

/**
 * Represents a geo-distance search query.
 *
 * @category Full Text Search
 */
export class GeoDistanceSearchQuery extends SearchQuery {
  declare _data: {
    location: [number, number];
    distance: number;
    field?: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor(lon: number, lat: number, distance: number) {
    super({
      location: [lon, lat],
      distance: distance,
    });
  }

  field(field: string): GeoDistanceSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): GeoDistanceSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a geo-bounding-box search query.
 *
 * @category Full Text Search
 */
export class GeoBoundingBoxSearchQuery extends SearchQuery {
  declare _data: {
    top_left: [number, number];
    bottom_right: [number, number];
    field?: string;
    boost?: number;
  };

  /**
   * @internal
   */
  constructor(tl_lon: number, tl_lat: number, br_lon: number, br_lat: number) {
    super({
      top_left: [tl_lon, tl_lat],
      bottom_right: [br_lon, br_lat],
    });
  }

  field(field: string): GeoBoundingBoxSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): GeoBoundingBoxSearchQuery {
    this._data.boost = boost;
    return this;
  }
}

/**
 * Represents a geo-polygon search query.
 *
 * @category Full Text Search
 */
export class GeoPolygonSearchQuery extends SearchQuery {
  declare _data: {
    polygon_points: GeoPoint[];
    boost?: number;
    field?: string;
  };

  /**
   * @internal
   */
  constructor(points: GeoPoint[]) {
    const mappedPoints = points.map((v) => normalizeGeoPoint(v));
    super({
      polygon_points: mappedPoints,
    });
  }

  field(field: string): GeoPolygonSearchQuery {
    this._data.field = field;
    return this;
  }

  boost(boost: number): GeoPolygonSearchQuery {
    this._data.boost = boost;
    return this;
  }
}
