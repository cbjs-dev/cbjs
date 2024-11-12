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

export type SearchSourceType = 'couchbase' | 'gocbcore';
export type SearchIndexType = 'fulltext-alias' | 'fulltext-index';
export type SearchStoreIndexType = 'scorch' | (string & NonNullable<unknown>);

export type ApiSearchIndexDefinition = SearchIndexCommonConfig &
  SearchIndexConfigIndexParams &
  SearchIndexConfigSourceParams;

export type SearchIndexCommonConfig = {
  /**
   * The UUID of the search index.  Used for updates to ensure consistency.
   */
  uuid?: string;

  /**
   * The name of the search index.
   */
  name: string;

  /**
   * Name of the source of the data (ie: the bucket name).
   */
  sourceName: string;

  /**
   * The UUID of the data source.
   */
  sourceUUID?: string;

  /**
   * Plan properties such as the number of replicas and number of partitions.
   */
  planParams?: {
    maxPartitionsPerPIndex?: number;
    nodePlanParams?: unknown;
    numReplicas?: number;
    indexPartitions?: number;
    planFrozen?: boolean;
  };
};

export type SearchIndexConfigIndexParams<T extends SearchIndexType = SearchIndexType> =
  Extract<
    | {
        /**
         * The type of index to use.
         */
        type: 'fulltext-alias';

        /**
         * Parameters to specify such as the store type and mappings.
         */
        params: SearchIndexIndexParamsCommon & SearchIndexIndexParamsIndexTypeAlias;
      }
    | {
        /**
         * The type of index to use.
         */
        type: 'fulltext-index';

        /**
         * Parameters to specify such as the store type and mappings.
         */
        params: SearchIndexIndexParamsCommon & SearchIndexIndexParamsIndexTypeBleve;
      },
    { type: T }
  >;

export type SearchIndexIndexParamsCommon = {
  doc_config: {
    docid_prefix_delim?: string;
    docid_regexp?: string;
    mode:
      | 'docid_prefix'
      | 'scope.collection.type_field'
      | (string & NonNullable<unknown>);
    type_field: string;
  };
  store?: {
    kvStoreName?: string;
    indexType?: SearchStoreIndexType;
    segmentVersion?: number;
  };
};

type SearchIndexIndexParamsIndexTypeAlias = {
  targets: {
    [indexName: string]: {
      indexUUID: string;
    };
  };
};

export type SearchIndexMappingFieldType =
  | 'text'
  | 'number'
  | 'datetime'
  | 'boolean'
  | 'disabled'
  | 'geopoint'
  | 'geoshape'
  | 'ip'
  | 'vector';

export type SearchIndexMappingFieldAnalyzer =
  | 'ar'
  | 'cjk'
  | 'ckb'
  | 'da'
  | 'de'
  | 'en'
  | 'es'
  | 'fa'
  | 'fi'
  | 'fr'
  | 'he'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'it'
  | 'keyword'
  | 'nl'
  | 'no'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'simple'
  | 'standard'
  | 'sv'
  | 'tr'
  | 'web';

export type SearchIndexIndexParamsIndexTypeBleve = {
  mapping: {
    default_mapping: {
      enabled: boolean;
      dynamic: boolean;
      default_analyzer?: string;
    };
    default_type: string;
    docvalues_dynamic?: boolean;
    default_analyzer: SearchIndexMappingFieldAnalyzer;
    default_datetime_parser: string;
    default_field: '_all' | (string & NonNullable<unknown>);
    byte_array_converter?: 'json' | (string & NonNullable<unknown>);
    analysis?: unknown;
    index_dynamic?: boolean;
    store_dynamic?: boolean;
    type_field: string;
    types: {
      [bucketName: string]: {
        dynamic: boolean;
        enabled: boolean;
        properties: {
          [name: string]: {
            enabled: boolean;
            dynamic: boolean;
            fields: Array<{
              analyzer?: SearchIndexMappingFieldAnalyzer;
              docvalues?: boolean;
              include_in_all?: boolean;
              include_term_vectors?: boolean;
              dims?: number;
              similarity?: string;
              index: boolean;
              name: string;
              store: boolean;
              type: SearchIndexMappingFieldType;
            }>;
          };
        };
      };
    };
  };
};

export type SearchIndexConfigSourceParams<
  T extends SearchSourceType | 'nil' = SearchSourceType | 'nil',
> = Extract<
  | {
      /**
       * The type of the source.
       */
      sourceType: SearchSourceType;

      /**
       * Extra parameters for the source. These are usually things like advanced
       * connection options and tuning parameters.
       */
      sourceParams?: SearchIndexConfigSourceParamsCouchbase;
    }
  | {
      /**
       * The type of the source.
       */
      sourceType: 'nil';

      /**
       * Extra parameters for the source. These are usually things like advanced
       * connection options and tuning parameters.
       */
      sourceParams?: unknown;
    },
  { sourceType: T }
>;

export type SearchIndexConfigSourceParamsCouchbase = {
  authUser?: string;
  authPassword?: string;
  authSaslUser?: string;
  authSaslPassword?: string;
  clusterManagerBackoffFactor?: number;
  clusterManagerSleepInitMS?: number;
  clusterManagerSleepMaxMS?: number;
  dataManagerBackoffFactor?: number;
  dataManagerSleepInitMS?: number;
  dataManagerSleepMaxMS?: number;
  feedBufferSizeBytes?: number;
  feedBufferAckThreshold?: number;
};
