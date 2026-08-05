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
import { CouchbaseHttpApiConfig, explainCreateQueryIndex } from '@cbjsdev/http-client';

import { areSameIndexDefinitions } from './areSameIndexDefinitions.js';
import {
  CouchbaseClusterCollectionConfig,
  CouchbaseClusterCollectionIndexConfig,
  CouchbaseClusterConfig,
} from './types.js';

export type CanonicalizeIndexConfigsOptions = {
  /**
   * The function used to obtain the server-canonical form of an index definition.
   *
   * Defaults to {@link explainCreateQueryIndex}. Injectable for testing.
   */
  explain?: typeof explainCreateQueryIndex;
};

/**
 * Rewrite the index definitions of the next config into a form that compares
 * textually against a config built from the live cluster.
 *
 * The server does not store the text of an index definition: it parses it and
 * re-prints it from its own AST — `OBJECT_LENGTH(timeEntries) > 0` is reported by
 * `system:indexes` as ``(0 < object_length(`timeEntries`))``. Diffing the declared
 * text against the live text would therefore report a change on every deployment,
 * and the index would be needlessly dropped and recreated every time.
 *
 * Every requested index that has a live counterpart with a textually different
 * definition is round-tripped through the server's own parser with
 * `EXPLAIN CREATE INDEX` — a planning-only statement that creates nothing. When the
 * canonical forms are equal, the requested definition is replaced by the live one, so
 * {@link getCouchbaseClusterChanges} sees no change. When they differ, the requested
 * definition is replaced by its canonical form, so the diff reports the change — and
 * reports precisely which properties changed, since both sides then use the same print.
 *
 * When the canonical form of the requested definition does not match the live text,
 * the live definition is itself round-tripped before concluding: an index created by
 * an older server version may have been printed differently at creation time. Both
 * sides are then printed by the same server, and the comparison is exact.
 *
 * Indexes without a live counterpart are left untouched: their keyspace may not even
 * exist yet, and there is nothing to compare them against.
 *
 * An invalid index definition makes this function throw: the server refuses to plan
 * it. This surfaces typos at diff time, before any change is applied to the cluster.
 */
export async function canonicalizeIndexConfigs<
  NextConfig extends Partial<CouchbaseClusterConfig>,
>(
  apiConfig: CouchbaseHttpApiConfig,
  currentConfig: Partial<CouchbaseClusterConfig>,
  nextConfig: NextConfig,
  options?: CanonicalizeIndexConfigsOptions
): Promise<NextConfig> {
  const explain = options?.explain ?? explainCreateQueryIndex;

  if (!nextConfig.keyspaces) {
    return nextConfig;
  }

  const keyspaceEntries = await Promise.all(
    Object.entries(nextConfig.keyspaces).map(async ([bucketName, bucket]) => {
      const scopeEntries = await Promise.all(
        Object.entries(bucket.scopes).map(async ([scopeName, scope]) => {
          const collectionEntries = await Promise.all(
            Object.entries(scope.collections).map(
              async ([collectionName, collection]) => {
                const canonicalCollection = await canonicalizeCollectionIndexes(
                  explain,
                  apiConfig,
                  currentConfig,
                  bucketName,
                  scopeName,
                  collectionName,
                  collection
                );

                return [collectionName, canonicalCollection] as const;
              }
            )
          );

          return [
            scopeName,
            { ...scope, collections: Object.fromEntries(collectionEntries) },
          ] as const;
        })
      );

      return [
        bucketName,
        { ...bucket, scopes: Object.fromEntries(scopeEntries) },
      ] as const;
    })
  );

  return { ...nextConfig, keyspaces: Object.fromEntries(keyspaceEntries) };
}

async function canonicalizeCollectionIndexes(
  explain: typeof explainCreateQueryIndex,
  apiConfig: CouchbaseHttpApiConfig,
  currentConfig: Partial<CouchbaseClusterConfig>,
  bucketName: string,
  scopeName: string,
  collectionName: string,
  collection: CouchbaseClusterCollectionConfig
): Promise<CouchbaseClusterCollectionConfig> {
  if (!collection.indexes) {
    return collection;
  }

  const currentIndexes =
    currentConfig.keyspaces?.[bucketName]?.scopes[scopeName]?.collections[collectionName]
      ?.indexes;

  const indexEntries = await Promise.all(
    Object.entries(collection.indexes).map(async ([indexName, requestedIndex]) => {
      const canonicalIndex = await canonicalizeIndex(
        explain,
        apiConfig,
        bucketName,
        scopeName,
        collectionName,
        indexName,
        requestedIndex,
        currentIndexes?.[indexName]
      );

      return [indexName, canonicalIndex] as const;
    })
  );

  return { ...collection, indexes: Object.fromEntries(indexEntries) };
}

async function canonicalizeIndex(
  explain: typeof explainCreateQueryIndex,
  apiConfig: CouchbaseHttpApiConfig,
  bucketName: string,
  scopeName: string,
  collectionName: string,
  indexName: string,
  requestedIndex: CouchbaseClusterCollectionIndexConfig,
  currentIndex: CouchbaseClusterCollectionIndexConfig | undefined
): Promise<CouchbaseClusterCollectionIndexConfig> {
  if (!currentIndex) {
    return requestedIndex;
  }

  if (areSameIndexDefinitions(requestedIndex, currentIndex)) {
    return requestedIndex;
  }

  const keyspace = { bucket: bucketName, scope: scopeName, collection: collectionName };

  const explainIndex = async (index: CouchbaseClusterCollectionIndexConfig) => {
    try {
      return await explain(apiConfig, indexName, keyspace, {
        keys: index.keys,
        where: index.where,
        with: index.with,
      });
    } catch (err) {
      throw new Error(
        `Failed to canonicalize the definition of index "${bucketName}.${scopeName}.${collectionName}#${indexName}": ${
          err instanceof Error ? err.message : String(err)
        }`,
        { cause: err }
      );
    }
  };

  const canonicalRequested = await explainIndex(requestedIndex);

  if (areSameIndexDefinitions(canonicalRequested, currentIndex)) {
    return withDefinitionOf(requestedIndex, currentIndex);
  }

  // The live definition may have been printed by an older server version.
  // Round-trip it through the current server so both sides use the same printer.
  const canonicalCurrent = await explainIndex(currentIndex);

  if (areSameIndexDefinitions(canonicalRequested, canonicalCurrent)) {
    return withDefinitionOf(requestedIndex, currentIndex);
  }

  // The index has really changed. Its canonical form is kept, rather than the
  // declared text, so the diff can report which properties changed precisely.
  return withDefinitionOf(requestedIndex, canonicalRequested);
}

/**
 * Replace the definition (keys and `WHERE` predicate) of `requestedIndex` by
 * `definition`, keeping every other property (`with`, `numReplicas`, …) declared.
 */
function withDefinitionOf(
  requestedIndex: CouchbaseClusterCollectionIndexConfig,
  definition: { keys: string[]; where?: string }
): CouchbaseClusterCollectionIndexConfig {
  const result: CouchbaseClusterCollectionIndexConfig = {
    ...requestedIndex,
    keys: [...definition.keys],
  };

  delete result.where;

  if (definition.where !== undefined) {
    result.where = definition.where;
  }

  return result;
}
