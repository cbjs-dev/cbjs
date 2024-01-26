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
import { CouchbaseHttpApiConfig } from '../../../types';
import { apiPOST } from '../../../utils/apiPOST';

export function requestStatistics(
  apiConfig: CouchbaseHttpApiConfig,
  stats: [StatisticDefinition, ...StatisticDefinition[]]
) {
  return apiPOST(apiConfig, '/pools/default/stats/range', JSON.stringify(stats));
}

type CouchbaseLabel = 'bucket' | 'scope' | 'collection' | 'index' | 'connection_type';
type GeneralLabel =
  | 'start'
  | 'end'
  | 'nodes'
  | 'nodesAggregation'
  | 'timeWindow'
  | 'timeout'
  | 'alignTimestamps';

type StatisticLabelSelector = {
  /**
   * Label name.
   */
  label: CouchbaseLabel | GeneralLabel | (string & NonNullable<unknown>);

  /**
   * Label value.
   */
  value: string;

  /**
   * Operator used to match the label.
   *
   * @default '='.
   */
  operator?: '=' | '!=' | '=~' | '~=';
};

export type StatisticFunction =
  | 'rate'
  | 'irate'
  | 'increase'
  | 'avg_over_time'
  | 'min_over_time'
  | 'max_over_time'
  | 'deriv'
  | 'delta'
  | 'idelta'
  | 'sum'
  | 'min'
  | 'max'
  | 'avg'
  | `p${number}`;

export type StatisticDefinition = {
  /**
   * An array of labels that defines the metric to collect.
   */
  metric: [
    Omit<StatisticLabelSelector, 'label'> & { label: 'name' },
    ...StatisticLabelSelector[]
  ];

  /**
   *
   */
  applyFunctions?: StatisticFunction[];

  /**
   * List of nodes from which data points should be collected.
   *
   * @default All the nodes.
   */
  nodes?: [string, ...string[]];

  /**
   * Whether and how aggregation of retrieved statistics is to be performed.
   *
   * @default No aggregation.
   */
  nodesAggregation?: 'max' | 'min' | 'sum' | 'avg';

  /**
   * Forces data point to be collected on timestamps that are multiple of `10`.
   *
   * @default false
   */
  alignTimestamps?: boolean;

  /**
   * An integer that set by how many seconds each data point is separated.
   *
   * @default 10
   */
  step?: number;

  /**
   * A negative integer that sets when to start the data points, in seconds.
   *
   * @default -60
   */
  start?: number;

  /**
   * A negative integer that sets when to end the data points, in seconds.
   *
   * @default 0
   */
  end?: number;

  /**
   * Statistics collection timeout, in milliseconds.
   *
   * @default 300_000 (5 minutes)
   */
  timeout?: number;
};

type DataPoint = [timestamp: number, value: `${number}`];

type StatisticsResultData = {
  metric: {
    nodes: [string, ...string[]];

    /**
     * Will be undefined if the request parameter `applyFunctions` was not empty.
     */
    instance?: string;

    category?: 'audit' | (string & NonNullable<unknown>);

    /**
     * Will be undefined if the request parameter `applyFunctions` was not empty.
     */
    name?: string;
  } & {
    [label in CouchbaseLabel]?: string;
  };
  values: [DataPoint, ...DataPoint[]];
};

export type StatisticsResult = {
  data: StatisticsResultData[];
  errors: Array<{ node: string; error: string }>;

  /**
   * Timestamp (in seconds) from which data points were collected.
   * Computed from the time of the request and the `start` parameter of the request.
   */
  startTimestamp: number;

  /**
   * Timestamp (in seconds) from which data points were no longer being collected.
   * Computed from the time of the request and the `end` parameter of the request.
   */
  endTimestamp: number;
};
