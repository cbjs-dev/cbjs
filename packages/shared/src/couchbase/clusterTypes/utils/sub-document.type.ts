/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
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
import { Split } from '../../../misc/index.js';
import { IsFuzzyDocument } from '../document.types.js';
import { ArrayLastElement } from './array-utils.types.js';

/**
 * Split a path into segments, if required.
 */
export type SplitIntoSegments<T extends string> = T extends string
  ? Split<T, '.', '`'> extends infer Segments extends readonly string[]
    ? SplitSegmentsAccessors<Segments>
    : never
  : T;

/**
 * Split a single segment into an ordered tuple of prop and array accessors.
 */
// prettier-ignore
export type SplitSegmentIntoAccessors<T extends string> =
  SplitSegmentIntoAccessorsTRE<T, [], `${string}`>
;

// prettier-ignore
export type SplitSegmentIntoAccessorsTRE<
  T extends string,
  Acc extends ReadonlyArray<string>,
  AccTemplate extends string,
> =
  T extends `${AccTemplate}[${infer Index extends number}][${string}]` ?
    SplitSegmentIntoAccessorsTRE<T, [...Acc, `[${Index}]`], `${AccTemplate}[${Index}]`> :
  T extends `${AccTemplate}[${infer Index extends number}]` ?
    T extends `${infer Prop}[${string}` ?
      Prop extends '' ?
        [...Acc, `[${Index}]`] :
      [Prop, ...Acc, `[${Index}]`] :
    never :
  [T]
;

/**
 * Split each segment into its accessors and return a flatten tuple.
 */
type SplitSegmentsAccessors<Segments extends readonly string[]> =
  SplitSegmentsAccessorsTRE<Segments, []>;

// prettier-ignore
type SplitSegmentsAccessorsTRE<
  Segments extends readonly string[],
  Acc extends ReadonlyArray<string>,
> =
  Segments extends [infer Segment extends string, ...infer Rest extends readonly string[]] ?
    SplitSegmentsAccessorsTRE<Rest, [...Acc, ...SplitSegmentIntoAccessors<Segment>]> :
  Acc
;

/**
 * Return the sub-document type from path segments.
 * Non-Distributive.
 */
// prettier-ignore
export type SubDocumentFromPathSegments<
  T,
  Segments extends ReadonlyArray<string>
> =
  Segments extends [infer Segment, ...infer RestSegments extends string[]] ?
    // Object access
    Segment extends keyof T ?
      RestSegments['length'] extends 0 ?
        T[Segment] :
      T[Segment] extends infer NextDoc ?
        NextDoc extends unknown ?
          SubDocumentFromPathSegments<NextDoc, RestSegments> :
          never :
        never :

    // Array access
    Segment extends `[${infer Index extends number}]` ?
      RestSegments['length'] extends 0 ?
        ArrayElementAtIndex<T, Index> :
      SubDocumentFromPathSegments<
        ArrayElementAtIndex<T, Index>,
        RestSegments
      > :

    Segment extends '' ? // Root
      T :
    never :
  never
;

// prettier-ignore
type ArrayElementAtIndex<T, K> = 
  K extends -1 ?
    ArrayLastElement<T> : 
  K extends keyof T ? 
    T[K] : 
  never
;

/**
 * Return the type of an element at a specific path.
 *
 * `DeepUndefined` toggles if `undefined` should be included in the result type when
 * a parent property is optional.
 *
 * @example
 *
 * ```ts
 * type TestDoc = {
 *   metadata?: { tags: string[] };
 * };
 *
 * SubDocument<TestDoc, 'metadata.tags'>        // string[] | undefined
 * SubDocument<TestDoc, 'metadata.tags', false> // string[]
 * ```
 */
// prettier-ignore
export type SubDocument<T, P extends string> =
  IsFuzzyDocument<T> extends true ? any : SubDocumentFromPathSegments<T, SplitIntoSegments<P>>
;
