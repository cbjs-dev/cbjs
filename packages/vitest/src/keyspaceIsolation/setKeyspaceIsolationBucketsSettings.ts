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
import { ICreateBucketSettings } from '@cbjsdev/cbjs';

import {
  defaultBucketSettingsSymbol,
  getCbjsContextTracking,
} from '../asyncContext/getCbjsContextTracking.js';

/**
 * Set the settings of each buckets of your cluster.
 * You can also define default settings using {@link setKeyspaceIsolationBucketsDefaultSettings},
 * used for all buckets not found in the settings array.
 * @param bucketsSettings
 */
export function setKeyspaceIsolationBucketsSettings(
  bucketsSettings: ICreateBucketSettings[]
) {
  const cbjsContext = getCbjsContextTracking();

  cbjsContext.bucketsSettings.clear();

  for (const bucketSettings of bucketsSettings) {
    cbjsContext.bucketsSettings.set(bucketSettings.name, bucketSettings);
  }
}

export function setKeyspaceIsolationBucketsDefaultSettings(
  bucketSettings: Omit<ICreateBucketSettings, 'name'>
) {
  const cbjsContext = getCbjsContextTracking();

  cbjsContext.bucketsSettings.set(defaultBucketSettingsSymbol, bucketSettings);
}

// TODO then to the same for index definitions
