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
import { ISearchIndex } from '@cbjsdev/cbjs';
import { Keyspace } from '@cbjsdev/shared';

export function getVectorSearchIndexConfig(
  name: string,
  keyspace: Keyspace
): ISearchIndex {
  return {
    name,
    sourceName: keyspace.bucket,
    sourceType: 'couchbase',
    type: 'fulltext-index',
    params: {
      doc_config: {
        docid_prefix_delim: '_',
        docid_regexp: '',
        mode: 'docid_prefix',
        type_field: 'type',
      },
      mapping: {
        default_analyzer: 'standard',
        default_datetime_parser: 'dateTimeOptional',
        default_field: '_all',
        default_mapping: {
          dynamic: true,
          enabled: false,
        },
        default_type: '_default',
        docvalues_dynamic: false,
        index_dynamic: true,
        store_dynamic: false,
        type_field: '_type',
        types: {
          [`${keyspace.scope}.${keyspace.collection}`]: {
            dynamic: false,
            enabled: true,
            properties: {
              text: {
                enabled: true,
                dynamic: false,
                fields: [
                  {
                    index: true,
                    name: 'text',
                    store: true,
                    type: 'text',
                  },
                ],
              },
              vector_field: {
                enabled: true,
                dynamic: false,
                fields: [
                  {
                    dims: 1536,
                    index: true,
                    name: 'vector_field',
                    similarity: 'l2_norm',
                    store: true,
                    type: 'vector',
                  },
                ],
              },
              testUid: {
                enabled: true,
                dynamic: false,
                fields: [
                  {
                    docvalues: true,
                    include_in_all: true,
                    include_term_vectors: true,
                    index: true,
                    name: 'testUid',
                    store: true,
                    type: 'text',
                  },
                ],
              },
            },
          },
        },
      },
      store: {
        indexType: 'scorch',
        segmentVersion: 16,
      },
    },
  };
}
