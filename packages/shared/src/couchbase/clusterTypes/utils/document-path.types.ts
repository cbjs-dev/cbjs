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
import { If, IsExactly, IsNever, Join, UnionToTuple } from '../../../misc/index.js';
import {
  ArrayInfoShape,
  ArrayLastElement,
  DropTupleHead,
  ExtractAppendableArray,
  ExtractPrependableArray,
  GetArrayInfo,
  IsArrayLengthFixed,
  IsIndexRemovalStrictlyForbidden,
  ResolveNegativeIndex,
  TupleFilter,
  TupleIndexes,
} from './array-utils.types.js';
import type { OptionalKeys, RequiredKeys, WritableKeys } from './misc-utils.types.js';
import {
  DocumentPath,
  ParentDocument,
  PathTargetExpression,
  PathToClosestObject,
  PathToClosestProperty,
  PathToParentAccessor,
  SplitIntoSegments,
  SubDocument,
} from './path-utils.types.js';

/**
 *  Extract document paths for which `Type` extends the target property type.
 *
 *  If `Strict` set to `false`, a simple comparison is performed:
 *    `Type: string` will extract paths to properties of type `string` or `string | undefined`.
 *
 *  If `Strict` set to `true`, a strict comparison is performed:
 *    `Type: string` will only extract paths to properties of type `string`. A property of type `string | undefined` will be excluded.
 */
// prettier-ignore
export type ExtractPathToType<
  Document,
  DocumentPath extends string,
  Type,
  Strict extends boolean = false,
> =
  Document extends unknown ?
    DocumentPath extends unknown ?
      SubDocument<Document, DocumentPath> extends infer SubDoc ?
        DocumentPath extends unknown ?
          Strict extends false ?
            [Type] extends [SubDoc] ?
              DocumentPath :
            never :
          IsExactly<Type, SubDoc> extends true ?
            DocumentPath :
          never :
        never :
      never :
    never :
  never
;

/**
 * Extract paths that point to a writable target.
 */
// prettier-ignore
export type ExtractPathToWritable<
  Document,
  DocumentPath extends string,
> =
  Document extends unknown ?
    DocumentPath extends unknown ?
      ParentDocument<Document, DocumentPath> extends infer ParentDoc ?
        ParentDoc extends Array<unknown> ?
          DocumentPath :
        ParentDoc extends ReadonlyArray<unknown> ?
          never :
        ParentDoc extends object ?
          PathTargetExpression<DocumentPath> extends WritableKeys<ParentDoc> ?
            DocumentPath :
          never :
        never :
      never :
    never :
  never
;

/**
 *  Extract document paths that point to a non-readonly property.
 */
// prettier-ignore
export type ExtractPathToWritableProperty<
  Document,
  DocumentPath extends string,
> =
  Document extends unknown ?
    DocumentPath extends unknown ?
      PathToClosestProperty<DocumentPath> extends infer PathToProperty extends string ?
        ExtractPathToWritable<Document, PathToProperty> extends infer PathToWritableProperty extends string ?
          PathToWritableProperty :
        never :
      never :
    never :
  never
;

/**
 * Extract paths that points to a POJO.
 */
// prettier-ignore
export type ExtractPathToPojo<
  Doc extends object,
  DocPath extends string = DocumentPath<Doc>,
> =
  DocPath extends unknown ?
    SubDocument<Doc, DocPath> extends infer SubDoc ?
      SubDoc extends Record<PropertyKey, unknown> ?
        DocPath :
      never :
    never :
  never
;

/**
 * Extract document paths that point to the index of a non-readonly array.
 * You can filter the type of the indexes by passing `FilterType`.
 */
export type ExtractPathToWritableArrayIndex<
  D,
  P extends string,
  FilterType = never,
> = D extends unknown
  ? P extends unknown
    ? ExtractPathToArrayIndex<P> extends infer PTAI extends string
      ? ExtractPathToWritable<D, PTAI> extends infer PathToWritableIndex extends unknown
        ? PathToWritableIndex extends string
          ? ParentDocument<D, PathToWritableIndex> extends infer SubDocArray
            ? SubDocArray extends ReadonlyArray<unknown>
              ? IsNever<FilterType> extends true
                ? PathToWritableIndex
                : PathToWritableIndex extends `${infer PathToArray extends PathToParentAccessor<PathToWritableIndex>}[${infer Index extends number}]`
                  ? GetArrayInfo<SubDocArray> extends infer Info extends ArrayInfoShape
                    ? FilterType extends Info['RestElement']
                      ? PathToWritableIndex
                      : Info['IsFullyStatic'] extends true
                        ? FilterType extends SubDocArray[ResolveNegativeIndex<
                            SubDocArray,
                            Index
                          >]
                          ? PathToWritableIndex
                          : never
                        : Info['IsHeadStatic'] extends true
                          ?
                              | TupleIndexes<Info['StaticSlice']>
                              | -1 extends infer TupleIndex extends number
                            ? FilterType extends SubDocArray[TupleIndex]
                              ? `${PathToArray}[${TupleIndex}]`
                              : never
                            : never
                          : Info['IsTailStatic'] extends true
                            ? TupleFilter<
                                Info['StaticSlice'],
                                FilterType
                              >['length'] extends 0
                              ? never
                              : 2 extends Partial<
                                    TupleFilter<Info['StaticSlice'], FilterType>
                                  >['length']
                                ? `${PathToArray}[${number}]`
                                : FilterType extends Info['StaticSlice'][ResolveNegativeIndex<
                                      Info['StaticSlice'],
                                      -1
                                    >]
                                  ? `${PathToArray}[-1]`
                                  : 1 extends Partial<
                                        TupleFilter<Info['StaticSlice'], FilterType>
                                      >['length']
                                    ? `${PathToArray}[${number}]`
                                    : never
                            : never
                    : never
                  : never
              : never
            : never
          : never
        : never
      : never
    : never
  : never;

/**
 * Extract document paths that point to a property of type array.
 */
export type ExtractPathToArray<D, P extends string> = D extends unknown
  ? P extends unknown
    ? SubDocument<D, P> extends infer SubDoc
      ? SubDoc extends ReadonlyArray<unknown>
        ? P
        : never
      : never
    : never
  : never;

/**
 * Extract document paths that point to a property of type object.
 */
export type ExtractPathToObject<D, P extends string> = D extends unknown
  ? P extends unknown
    ? SubDocument<D, P> extends infer SubDoc
      ? SubDoc extends Record<string, unknown>
        ? P
        : never
      : never
    : never
  : never;

/**
 *  Extract document paths that point to non-readonly property to which you can assign the specified type.
 */
export type ExtractPathToArrayIndex<DocumentPath extends string> =
  DocumentPath extends unknown
    ? DocumentPath extends `${string}[${string}]`
      ? DocumentPath
      : never
    : never;

/**
 * Extract document paths that point to an array to which you can prepend an element.
 */
export type ExtractPathToPrependableArray<D, P extends string> = D extends unknown
  ? P extends unknown
    ? SubDocument<D, PathToClosestProperty<P>> extends infer SubDoc
      ? SubDoc extends ReadonlyArray<unknown>
        ? SubDoc extends ExtractPrependableArray<SubDoc>
          ? PathToClosestProperty<P>
          : never
        : never
      : never
    : never
  : never;

/**
 * Extract document paths that point to an array to which you can append an element.
 */
export type ExtractPathToAppendableArray<D, P extends string> = D extends unknown
  ? P extends unknown
    ? SubDocument<D, P> extends infer SubDoc
      ? SubDoc extends ReadonlyArray<unknown>
        ? SubDoc extends ExtractAppendableArray<SubDoc>
          ? P
          : never
        : never
      : never
    : never
  : never;

/**
 *  Extract document paths that point to an array's index which can be removed.
 */
// prettier-ignore
export type ExtractPathToRemovableArrayIndex<
  Document,
  DocumentPath extends string,
> =
  Document extends unknown ?
    DocumentPath extends unknown ?
      ExtractPathToArrayIndex<DocumentPath> extends infer PathToArrayIndex extends string ?
        PathTargetExpression<PathToArrayIndex> extends `${string}[${infer Index extends number}]` ?
          Extract<
            ParentDocument<Document, PathToArrayIndex>,
            ReadonlyArray<unknown>
          > extends infer ParentDoc extends ReadonlyArray<unknown> ?
            IsIndexRemovalStrictlyForbidden<ParentDoc, Index> extends true ?
              never :
            PathToArrayIndex :
          never :
        never :
      never :
    never :
  never
;

/**
 *  Extract document paths that point to a POJO's property which can be set or unset.
 */
// prettier-ignore
export type ExtractPathToOptionalProperty<
  Doc extends object,
  DocPath extends string = DocumentPath<Doc>,
> =
  DocPath extends unknown ?
    // The path targets an array index - we skip
    DocPath extends `${string}[${number}]` ?
      never :

    Extract<ParentDocument<Doc, DocPath>, Record<PropertyKey, unknown>> extends infer ParentDoc ?
      ArrayLastElement<SplitIntoSegments<DocPath>> extends infer PropertyName extends string ?
        PropertyName extends OptionalKeys<ParentDoc> ?
          DocPath :
        never :
      never :
    never :
  never
;

/**
 * Refine the path validity by checking the segments of the paths to make sure they don't contain ".".
 *
 * Given `{ profiles: Record<string, { name: string }> }`, then `profiles.${string}` is one of the path.
 * Inserting "profiles.default.foo" is forbidden because there is no property `foo`.
 * Yet "profiles.default.foo" extends `profiles.${string}`.
 *
 * This type fixes that.
 */
// prettier-ignore
export type ValidatePathToOptionalProperty<Doc extends object, UserPath extends string> =
  [PathToClosestObject<Doc, UserPath>] extends [infer ClosestObjectPath extends string] ?
    IsExactly<UserPath, ClosestObjectPath> extends true ?
      UserPath :
    UserPath extends `${ClosestObjectPath}.${infer RecordDeepPath}` ?
      SplitIntoSegments<RecordDeepPath> extends infer Segments extends ReadonlyArray<string> ?
        // Incomplete path: "membership." <= nothing after the dot.
        Segments['length'] extends 0 ?
          never :

        // New entry in the record => ALLOWED
        Segments['length'] extends 1 ?
          [Exclude<SubDocument<Doc, ClosestObjectPath>, undefined>] extends [infer BaseObject] ?
            undefined extends SubDocument<BaseObject, Segments[0]> ?
              UserPath :
            never :
          never :
        never :
      never :
    // root property
    ExtractPathToType<Doc, UserPath, undefined> :
  never
;

/**
 * Refine the path validity by checking the segments of the paths to make sure they don't contain ".".
 *
 * Given `{ profiles: Record<string, { name: string }> }`, then `profiles.${string}` is one of the path.
 * Inserting "profiles.default.foo" is forbidden because there is no property `foo`.
 * Yet "profiles.default.foo" extends `profiles.${string}`.
 *
 * This type fixes that.
 */
// prettier-ignore
export type ValidatePathToProperty<Doc extends object, UserPath extends string> =
  [PathToClosestObject<Doc, UserPath>] extends [infer ClosestObjectPath extends string] ?
    IsExactly<UserPath, ClosestObjectPath> extends true ?
      UserPath :
    UserPath extends `${ClosestObjectPath}.${infer RecordDeepPath}` ?
      SplitIntoSegments<RecordDeepPath> extends infer Segments extends ReadonlyArray<string> ?
        // Incomplete path: "membership." <= nothing after the dot.
        Segments['length'] extends 0 ?
          never :

        // New entry in the record => ALLOWED
        Segments['length'] extends 1 ?
          [SubDocument<Doc, ClosestObjectPath>] extends [infer BaseObject] ?
            IsNever<BaseObject> extends true ?
              never :
            UserPath :
          never :
        never :
      never :
    // root property
    If<IsNever<SubDocument<Doc, UserPath>>, never, UserPath> :
  never
;

/**
 * Path to properties that may be undefined ; either themselves or because a parent is.
 */
export type PathToMaybeUndefinedProperty<
  Doc extends object,
  Path extends string = DocumentPath<Doc>,
> = ExtractPathToType<Doc, ExtractPathToWritableProperty<Doc, Path>, undefined>;

/**
 *  Extract document paths that point to an array's index at which we can insert an element.
 */
export type ExtractPathToInsertableArrayIndex<
  Document,
  DocumentPath extends string,
> = Document extends unknown
  ? DocumentPath extends unknown
    ? ExtractPathToArrayIndex<DocumentPath> extends infer PathToArrayIndex extends string
      ? PathTargetExpression<PathToArrayIndex> extends `${string}[${number}]`
        ? Extract<
            ParentDocument<Document, PathToArrayIndex>,
            ReadonlyArray<unknown>
          > extends infer ParentDoc extends ReadonlyArray<unknown>
          ? IsArrayLengthFixed<ParentDoc> extends true
            ? never
            : PathToArrayIndex
          : never
        : never
      : never
    : never
  : never;
