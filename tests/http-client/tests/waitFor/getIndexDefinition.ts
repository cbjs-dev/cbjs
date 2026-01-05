import { ISearchIndex } from '@cbjsdev/cbjs';
import { Keyspace } from '@cbjsdev/shared';

/**
 * Create a search index on the `title` field.
 */
export default function (
  name: string,
  { bucket, scope, collection }: Keyspace
): ISearchIndex {
  return {
    name,
    type: 'fulltext-index',
    params: {
      doc_config: {
        docid_prefix_delim: '',
        docid_regexp: '',
        mode: 'scope.collection.type_field',
        type_field: 'type',
      },
      mapping: {
        default_analyzer: 'standard',
        default_datetime_parser: 'dateTimeOptional',
        default_field: '_all',
        default_mapping: {
          dynamic: false,
          enabled: false,
        },
        default_type: collection,
        docvalues_dynamic: false,
        index_dynamic: false,
        store_dynamic: false,
        type_field: '_type',
        types: {
          [`${scope}.${collection}`]: {
            dynamic: false,
            enabled: true,
            properties: {
              title: {
                enabled: true,
                dynamic: false,
                fields: [
                  {
                    analyzer: 'en',
                    index: true,
                    name: 'title',
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
        segmentVersion: 15,
      },
    },
    sourceType: 'gocbcore',
    sourceName: bucket,
    sourceParams: {},
    planParams: {
      maxPartitionsPerPIndex: 1024,
      indexPartitions: 1,
      numReplicas: 0,
    },
  };
}
