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

/* eslint jsdoc/require-jsdoc: off */
'use strict';

interface SdPathPartProp {
  type: 'property';
  path: string;
}

interface SdPathPartIndex {
  type: 'index';
  index: number;
}

type SdPathPart = SdPathPartProp | SdPathPartIndex;

export class SdUtils {
  private static _parsePath(path: string): SdPathPart[] {
    if (!path) {
      return [];
    }

    let identifier = '';
    const parts: SdPathPart[] = [];

    for (let i = 0; i < path.length; ++i) {
      if (path[i] === '[') {
        // Starting an array, use the previous bit as a property
        if (identifier) {
          parts.push({ type: 'property', path: identifier });
          identifier = '';
        }
      } else if (path[i] === ']') {
        // array path of identifier;
        parts.push({ type: 'index', index: parseInt(identifier) });
        identifier = '';
        // skip the `.` that follows, if there is one
        ++i;
      } else if (path[i] === '.') {
        parts.push({ type: 'property', path: identifier });
        identifier = '';
      } else {
        identifier += path[i];
      }
    }

    if (identifier) {
      parts.push({ type: 'property', path: identifier });
    }

    return parts;
  }

  private static _insertByPath(root: any, parts: SdPathPart[], value: any): any {
    if (parts.length === 0) {
      return value;
    }

    const firstPart = parts.shift() as SdPathPart;
    if (firstPart.type === 'property') {
      if (!root) {
        root = {};
      }
      if (Array.isArray(root)) {
        throw new Error('expected object, found array');
      }

      root[firstPart.path] = this._insertByPath(root[firstPart.path], parts, value);
    } else if (firstPart.type === 'index') {
      if (!root) {
        root = [];
      }
      if (!Array.isArray(root)) {
        throw new Error('expected array, found object');
      }

      root[firstPart.index] = this._insertByPath(root[firstPart.index], parts, value);
    } else {
      throw new Error('encountered unexpected path type');
    }

    return root;
  }

  static insertByPath(root: any, path: string, value: any): any {
    const parts = this._parsePath(path);
    return this._insertByPath(root, parts, value);
  }

  private static _getByPath(value: any, parts: SdPathPart[]): any {
    if (parts.length === 0) {
      return value;
    }

    const firstPart = parts.shift() as SdPathPart;
    if (firstPart.type === 'property') {
      if (!value) {
        return undefined;
      }
      if (Array.isArray(value)) {
        throw new Error('expected object, found array');
      }

      return this._getByPath(value[firstPart.path], parts);
    } else if (firstPart.type === 'index') {
      if (!value) {
        return undefined;
      }
      if (!Array.isArray(value)) {
        throw new Error('expected array, found object');
      }

      return this._getByPath(value[firstPart.index], parts);
    } else {
      throw new Error('encountered unexpected path type');
    }
  }

  static getByPath(value: any, path: string): any {
    const parts = this._parsePath(path);
    return this._getByPath(value, parts);
  }
}
