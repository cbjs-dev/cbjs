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
import { OneOf } from '@cbjsdev/shared';

export type QueryResultIndexes = QueryResultGsiIndex | QueryResultSearchIndex;

export type QueryResultGsiIndex = DiscriminatingPrimaryIndexProps &
  DiscriminatingKeyspaceProps & {
    datastore_id: string;
    id: string;

    /**
     * Index name.
     */
    name: string;
    namespace_id: string;
    state: 'online' | 'deferred' | (string & NonNullable<unknown>);
    using: 'gsi';
    metadata: {
      num_replica: number;
    };
  };

/**
 * Search index as described by the Query service.
 */
export type QueryResultSearchIndex = DiscriminatingKeyspaceProps & {
  datastore_id: string;
  id: string;

  /**
   * Index name.
   */
  name: string;
  index_key: [string, ...string[]];
  namespace_id: string;
  state: 'online' | 'deferred' | (string & NonNullable<unknown>);
  using: 'fts';
};

type DiscriminatingPrimaryIndexProps =
  | {
      is_primary: true;
      /**
       * Indexed fields.
       */
      index_key: [];
    }
  | {
      is_primary?: undefined;
      /**
       * Indexed fields.
       */
      index_key: [string, ...string[]];
    };

type DiscriminatingKeyspaceProps = OneOf<
  [
    // Cluster level index
    {
      /**
       * Bucket name.
       */
      keyspace_id: string;
    },
    // Collection level index
    {
      /**
       * Bucket name
       */
      bucket_id: string;

      /**
       * Scope name.
       */
      scope_id: string;

      /**
       * Collection name.
       */
      keyspace_id: string;
    },
  ]
>;
