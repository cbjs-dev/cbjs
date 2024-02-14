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
import { invariant } from '@cbjs/shared';

import { ConnectOptions } from './cluster';

/**
 * IConfigProfile specifies a ConfigProfile which applies
 * specified option values to ConnectionOptions.
 *
 * Volatile: This API is subject to change at any time.
 */
export interface IConfigProfile {
  /**
   * Applies the ConfigProfile options to the provided ConnectOptions.
   *
   * Volatile: This API is subject to change at any time.
   *
   * @param options The Connect options the ConfigProfile should be applied toward.
   */
  apply(options: ConnectOptions): void;
}

/**
 * The WAN Development profile sets various timeout options that are useful
 * when working in a WAN environment.
 *
 * Volatile: This API is subject to change at any time.
 */
export class WanDevelopmentProfile implements IConfigProfile {
  /**
   * Applies the ConfigProfile options to the provided ConnectOptions.
   *
   * Volatile: This API is subject to change at any time.
   *
   * @param options The Connect options the ConfigProfile should be applied toward.
   */
  apply(options: ConnectOptions): void {
    // the profile should override previously set values
    options.timeouts = {
      ...options.timeouts,
      ...{
        kvTimeout: 20000,
        kvDurableTimeout: 20000,
        analyticsTimeout: 120000,
        managementTimeout: 120000,
        queryTimeout: 120000,
        searchTimeout: 120000,
        viewTimeout: 120000,
        bootstrapTimeout: 120000,
        connectTimeout: 20000,
        resolveTimeout: 20000,
      },
    };
    options.dnsConfig = { ...options.dnsConfig, ...{ dnsSrvTimeout: 20000 } };
  }
}

/**
 * The ConfigProfiles class keeps track of registered/known Configuration Profiles.
 *
 * Volatile: This API is subject to change at any time.
 */
export class ConfigProfiles {
  private profiles = new Map<string, IConfigProfile>();

  constructor() {
    this.resetProfiles();
  }

  /**
   * Applies the specified registered ConfigProfile to the provided ConnectOptions.
   *
   * Volatile: This API is subject to change at any time.
   *
   *  @param profileName The name of the ConfigProfile to apply.
   *  @param options The Connect options the ConfigProfile should be applied toward.
   */
  applyProfile(profileName: string, options: ConnectOptions): void {
    if (!this.profiles.has(profileName)) {
      throw new Error(`${profileName} is not a registered profile.`);
    }

    const profile = this.profiles.get(profileName);
    invariant(profile);

    profile.apply(options);
  }

  /**
   * Registers a ConfigProfile under the specified name.
   *
   * Volatile: This API is subject to change at any time.
   *
   *  @param profileName The name the ConfigProfile should be registered under.
   *  @param profile The ConfigProfile to register.
   */
  registerProfile(profileName: string, profile: IConfigProfile): void {
    this.profiles.set(profileName, profile);
  }

  /**
   * Unregisters the specified ConfigProfile.
   *
   * Volatile: This API is subject to change at any time.
   *
   *  @param profileName The name of the ConfigProfile to unregister.
   */
  unregisterProfile(profileName: string): void {
    this.profiles.delete(profileName);
  }

  clearProfiles() {
    this.profiles.clear();
  }

  resetProfiles() {
    this.clearProfiles();
    this.registerProfile('wanDevelopment', new WanDevelopmentProfile());
  }
}

export const connectionProfiles = new ConfigProfiles();
