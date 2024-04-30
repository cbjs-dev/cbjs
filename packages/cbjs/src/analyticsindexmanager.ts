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
import { ApiAnalyticsLink } from '@cbjsdev/http-client';
import { CouchbaseClusterTypes } from '@cbjsdev/shared';

import { Cluster } from './cluster.js';
import {
  CouchbaseError,
  DatasetExistsError,
  DatasetNotFoundError,
  DataverseExistsError,
  DataverseNotFoundError,
  LinkExistsError,
} from './errors.js';
import { HttpExecutor, HttpMethod, HttpServiceType } from './httpexecutor.js';
import {
  cbQsStringify,
  NodeCallback,
  PromiseHelper,
  VoidNodeCallback,
} from './utilities.js';
import { toEnumMember } from './utilities_internal.js';
import { resolveOptionsAndCallback } from './utils/resolveOptionsAndCallback.js';

/**
 * Represents the type of an analytics link.
 *
 * @category Analytics
 */
export enum AnalyticsLinkType {
  /**
   * Indicates that the link is for S3.
   */
  S3External = 's3',

  /**
   * Indicates that the link is for Azure.
   */
  AzureBlobExternal = 'azureblob',

  /**
   * Indicates that the link is for a remote Couchbase cluster.
   */
  CouchbaseRemote = 'couchbase',
}

/**
 * Represents what level of encryption to use for analytics remote links.
 *
 * @category Analytics
 */
export enum AnalyticsEncryptionLevel {
  /**
   * Indicates that no encryption should be used.
   */
  None = 'none',

  /**
   * Indicates that half encryption should be used.
   */
  Half = 'half',

  /**
   * Indicates that full encryption should be used.
   */
  Full = 'full',
}

/**
 * Contains a specific dataset configuration for the analytics service.
 *
 * @category Management
 */
export class AnalyticsDataset {
  /**
   * The name of the dataset.
   */
  name: string;

  /**
   * The name of the dataverse that this dataset exists within.
   */
  dataverseName: string;

  /**
   * The name of the link that is associated with this dataset.
   */
  linkName: string;

  /**
   * The name of the bucket that this dataset includes.
   */
  bucketName: string;

  /**
   * @internal
   */
  constructor(data: AnalyticsDataset) {
    this.name = data.name;
    this.dataverseName = data.dataverseName;
    this.linkName = data.linkName;
    this.bucketName = data.bucketName;
  }
}

/**
 * Contains a specific index configuration for the analytics service.
 *
 * @category Management
 */
export class AnalyticsIndex {
  /**
   * The name of the index.
   */
  name: string;

  /**
   * The name of the dataset this index belongs to.
   */
  datasetName: string;

  /**
   * The name of the dataverse this index belongs to.
   */
  dataverseName: string;

  /**
   * Whether or not this is a primary index or not.
   */
  isPrimary: boolean;

  /**
   * @internal
   */
  constructor(data: AnalyticsIndex) {
    this.name = data.name;
    this.datasetName = data.datasetName;
    this.dataverseName = data.dataverseName;
    this.isPrimary = data.isPrimary;
  }
}

/**
 * Specifies encryption options for an analytics remote link.
 */
export interface ICouchbaseAnalyticsEncryptionSettings {
  /**
   * Specifies what level of encryption should be used.
   */
  encryptionLevel: AnalyticsEncryptionLevel;

  /**
   * Provides a certificate to use for connecting when encryption level is set
   * to full.  Required when encryptionLevel is set to Full.
   */
  certificate?: Buffer;

  /**
   * Provides a client certificate to use for connecting when encryption level
   * is set to full.  Cannot be set if a username/password are used.
   */
  clientCertificate?: Buffer;

  /**
   * Provides a client key to use for connecting when encryption level is set
   * to full.  Cannot be set if a username/password are used.
   */
  clientKey?: Buffer;
}

/**
 * Includes information about an analytics remote links encryption.
 */
export class CouchbaseAnalyticsEncryptionSettings
  implements ICouchbaseAnalyticsEncryptionSettings
{
  /**
   * Specifies what level of encryption should be used.
   */
  encryptionLevel: AnalyticsEncryptionLevel;

  /**
   * Provides a certificate to use for connecting when encryption level is set
   * to full.  Required when encryptionLevel is set to Full.
   */
  certificate?: Buffer;

  /**
   * Provides a client certificate to use for connecting when encryption level
   * is set to full.  Cannot be set if a username/password are used.
   */
  clientCertificate?: Buffer;

  /**
   * Provides a client key to use for connecting when encryption level is set
   * to full.  Cannot be set if a username/password are used.
   */
  clientKey?: Buffer;

  /**
   * @internal
   */
  constructor(data: CouchbaseAnalyticsEncryptionSettings) {
    this.encryptionLevel = data.encryptionLevel;
    this.certificate = data.certificate;
    this.clientCertificate = data.clientCertificate;
    this.clientKey = data.clientKey;
  }
}

/**
 * Provides a base class for specifying options for an analytics link.
 *
 * @category Management
 */
export interface IAnalyticsLink {
  /**
   * Specifies what type of analytics link this represents.
   */
  linkType: AnalyticsLinkType;
}

/**
 * This is a base class for specific link configurations for the analytics service.
 */
export abstract class AnalyticsLink implements IAnalyticsLink {
  /**
   * @internal
   */
  constructor() {
    this.linkType = '' as AnalyticsLinkType;
  }

  /**
   * Specifies what type of analytics link this represents.
   */
  linkType: AnalyticsLinkType;

  /**
   * @internal
   */
  static _toHttpData(data: IAnalyticsLink): any {
    switch (data.linkType) {
      case AnalyticsLinkType.CouchbaseRemote:
        return CouchbaseRemoteAnalyticsLink._toHttpData(
          data as ICouchbaseRemoteAnalyticsLink
        );
      case AnalyticsLinkType.S3External:
        return S3ExternalAnalyticsLink._toHttpData(data as IS3ExternalAnalyticsLink);
      case AnalyticsLinkType.AzureBlobExternal:
        return AzureExternalAnalyticsLink._toHttpData(
          data as IAzureExternalAnalyticsLink
        );
    }

    throw new Error('invalid link type');
  }

  /**
   * @internal
   */
  static _fromHttpData(data: any): AnalyticsLink {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    switch (data.type) {
      case 'couchbase':
        return CouchbaseRemoteAnalyticsLink._fromHttpData(data);
      case 's3':
        return S3ExternalAnalyticsLink._fromHttpData(data);
      case 'azure':
        return AzureExternalAnalyticsLink._fromHttpData(data);
    }

    throw new Error('invalid link type');
  }
}

/**
 * Provides options for configuring an analytics remote couchbase cluster link.
 */
export interface ICouchbaseRemoteAnalyticsLink extends IAnalyticsLink {
  /**
   * Specifies what type of analytics link this represents.
   */
  linkType: AnalyticsLinkType.CouchbaseRemote;

  /**
   * The dataverse that this link belongs to.
   */
  dataverse: string;

  /**
   * The name of this link.
   */
  name: string;

  /**
   * The hostname of the target Couchbase cluster.
   */
  hostname: string;

  /**
   * The encryption settings to be used for the link.
   */
  encryption?: ICouchbaseAnalyticsEncryptionSettings;

  /**
   * The username to use for authentication with the remote cluster.  Optional
   * if client-certificate authentication
   * (@see ICouchbaseAnalyticsEncryptionSettings.clientCertificate) is being used.
   */
  username?: string;

  /**
   * The password to use for authentication with the remote cluster.  Optional
   * if client-certificate authentication
   * (@see ICouchbaseAnalyticsEncryptionSettings.clientCertificate) is being used.
   */
  password?: string;
}

/**
 * Provides information about a analytics remote Couchbase link.
 */
export class CouchbaseRemoteAnalyticsLink
  extends AnalyticsLink
  implements ICouchbaseRemoteAnalyticsLink
{
  /**
   * Specifies what type of analytics link this represents.
   */
  override linkType: AnalyticsLinkType.CouchbaseRemote;

  /**
   * The dataverse that this link belongs to.
   */
  dataverse: string;

  /**
   * The name of this link.
   */
  name: string;

  /**
   * The hostname of the target Couchbase cluster.
   */
  hostname: string;

  /**
   * The encryption settings to be used for the link.
   */
  encryption?: CouchbaseAnalyticsEncryptionSettings;

  /**
   * The username to use for authentication with the remote cluster.  Optional
   * if client-certificate authentication
   * (@see ICouchbaseAnalyticsEncryptionSettings.clientCertificate) is being used.
   */
  username?: string;

  /**
   * The password to use for authentication with the remote cluster.  Optional
   * if client-certificate authentication
   * (@see ICouchbaseAnalyticsEncryptionSettings.clientCertificate) is being used.
   */
  password?: string;

  /**
   * @internal
   */
  constructor(data: CouchbaseRemoteAnalyticsLink) {
    super();
    this.linkType = AnalyticsLinkType.CouchbaseRemote;

    this.dataverse = data.dataverse;
    this.name = data.name;
    this.hostname = data.hostname;
    this.encryption = data.encryption;
    this.username = data.username;
    this.password = data.password;
  }

  /**
   * @internal
   */
  static override _toHttpData(data: ICouchbaseRemoteAnalyticsLink): any {
    let dvSpecific;
    if (data.dataverse.indexOf('/') !== -1) {
      const encDataverse = encodeURIComponent(data.dataverse);
      const encName = encodeURIComponent(data.name);
      dvSpecific = {
        httpPath: `/analytics/link/${encDataverse}/${encName}`,
      };
    } else {
      dvSpecific = {
        httpPath: `/analytics/link`,
        dataverse: data.dataverse,
        name: data.name,
      };
    }

    return {
      type: 'couchbase',
      ...dvSpecific,
      hostname: data.hostname,
      username: data.username,
      password: data.password,
      encryption: data.encryption?.encryptionLevel,
      certificate: data.encryption?.certificate?.toString(),
      clientCertificate: data.encryption?.clientCertificate?.toString(),
      clientKey: data.encryption?.clientKey?.toString(),
    };
  }

  /**
   * @internal
   */
  static override _fromHttpData(data: Record<string, any>): CouchbaseRemoteAnalyticsLink {
    return new CouchbaseRemoteAnalyticsLink({
      linkType: AnalyticsLinkType.CouchbaseRemote,
      dataverse: data.dataverse ?? data.scope,
      name: data.name,
      hostname: data.activeHostname,
      encryption: new CouchbaseAnalyticsEncryptionSettings({
        encryptionLevel: toEnumMember(AnalyticsEncryptionLevel, data.encryption),
        certificate: Buffer.from(data.certificate),
        clientCertificate: Buffer.from(data.clientCertificate),
        clientKey: Buffer.from(data.clientKey),
      }),
      username: data.username,
      password: undefined,
    });
  }
}

/**
 * Provides options for configuring an analytics remote S3 link.
 */
export interface IS3ExternalAnalyticsLink extends IAnalyticsLink {
  /**
   * Specifies what type of analytics link this represents.
   */
  linkType: AnalyticsLinkType.S3External;

  /**
   * The dataverse that this link belongs to.
   */
  dataverse: string;

  /**
   * The name of this link.
   */
  name: string;

  /**
   * The AWS S3 access key.
   */
  accessKeyId: string;

  /**
   * The AWS S3 secret key.
   */
  secretAccessKey?: string;

  /**
   * The AWS S3 token if temporary credentials are provided.  Only available
   * in Couchbase Server 7.0 and above.
   */
  sessionToken?: string;

  /**
   * The AWS S3 region.
   */
  region: string;

  /**
   * The AWS S3 service endpoint.
   */
  serviceEndpoint?: string;
}

/**
 * Provides information about a analytics remote S3 link.
 */
export class S3ExternalAnalyticsLink
  extends AnalyticsLink
  implements IS3ExternalAnalyticsLink
{
  /**
   * Specifies what type of analytics link this represents.
   */
  override linkType: AnalyticsLinkType.S3External;

  /**
   * The dataverse that this link belongs to.
   */
  dataverse: string;

  /**
   * The name of this link.
   */
  name: string;

  /**
   * The AWS S3 access key.
   */
  accessKeyId: string;

  /**
   * The AWS S3 secret key.
   */
  secretAccessKey?: string;

  /**
   * The AWS S3 token if temporary credentials are provided.  Only available
   * in Couchbase Server 7.0 and above.
   */
  sessionToken?: string;

  /**
   * The AWS S3 region.
   */
  region: string;

  /**
   * The AWS S3 service endpoint.
   */
  serviceEndpoint?: string;

  /**
   * @internal
   */
  constructor(data: S3ExternalAnalyticsLink) {
    super();
    this.linkType = AnalyticsLinkType.S3External;

    this.dataverse = data.dataverse;
    this.name = data.name;
    this.accessKeyId = data.accessKeyId;
    this.secretAccessKey = data.secretAccessKey;
    this.sessionToken = data.sessionToken;
    this.region = data.region;
    this.serviceEndpoint = data.serviceEndpoint;
  }

  /**
   * @internal
   */
  static override _toHttpData(data: IS3ExternalAnalyticsLink): any {
    let dvSpecific;
    if (data.dataverse?.indexOf('/') !== -1) {
      const encDataverse = encodeURIComponent(data.dataverse);
      const encName = encodeURIComponent(data.name);
      dvSpecific = {
        httpPath: `/analytics/link/${encDataverse}/${encName}`,
      };
    } else {
      dvSpecific = {
        httpPath: `/analytics/link`,
        dataverse: data.dataverse,
        name: data.name,
      };
    }

    return {
      type: 's3',
      ...dvSpecific,
      accessKeyId: data.accessKeyId,
      secretAccessKey: data.secretAccessKey,
      region: data.region,
      sessionToken: data.sessionToken,
      serviceEndpoint: data.serviceEndpoint,
    };
  }

  /**
   * @internal
   */
  static override _fromHttpData(data: Record<string, any>): S3ExternalAnalyticsLink {
    return new S3ExternalAnalyticsLink({
      linkType: AnalyticsLinkType.S3External,
      dataverse: data.dataverse ?? data.scope,
      name: data.name,
      accessKeyId: data.accessKeyId,
      secretAccessKey: undefined,
      region: data.region,
      sessionToken: undefined,
      serviceEndpoint: data.serviceEndpoint,
    });
  }
}

/**
 * Provides options for configuring an analytics remote Azure link.
 */
export interface IAzureExternalAnalyticsLink extends IAnalyticsLink {
  /**
   * Specifies what type of analytics link this represents.
   */
  linkType: AnalyticsLinkType.AzureBlobExternal;

  /**
   * The dataverse that this link belongs to.
   */
  dataverse: string;

  /**
   * The name of this link.
   */
  name: string;

  /**
   * The connection string to use to connect to the external Azure store.
   */
  connectionString?: string;

  /**
   * The Azure blob storage account name.
   */
  accountName?: string;

  /**
   * The Azure blob storage account key.
   */
  accountKey?: string;

  /**
   * The shared access signature to use for authentication.
   */
  sharedAccessSignature?: string;

  /**
   * The Azure blob storage endpoint.
   */
  blobEndpoint?: string;

  /**
   * The Azure blob endpoint suffix.
   */
  endpointSuffix?: string;
}

/**
 * Provides information about a analytics remote S3 link.
 */
export class AzureExternalAnalyticsLink
  extends AnalyticsLink
  implements IAzureExternalAnalyticsLink
{
  /**
   * Specifies what type of analytics link this represents.
   */
  override linkType: AnalyticsLinkType.AzureBlobExternal;

  /**
   * The dataverse that this link belongs to.
   */
  dataverse: string;

  /**
   * The name of this link.
   */
  name: string;

  /**
   * The connection string to use to connect to the external Azure store.
   */
  connectionString?: string;

  /**
   * The Azure blob storage account name.
   */
  accountName?: string;

  /**
   * The Azure blob storage account key.
   */
  accountKey?: string;

  /**
   * The shared access signature to use for authentication.
   */
  sharedAccessSignature?: string;

  /**
   * The Azure blob storage endpoint.
   */
  blobEndpoint?: string;

  /**
   * The Azure blob endpoint suffix.
   */
  endpointSuffix?: string;

  /**
   * @internal
   */
  constructor(data: AzureExternalAnalyticsLink) {
    super();
    this.linkType = AnalyticsLinkType.AzureBlobExternal;

    this.dataverse = data.dataverse;
    this.name = data.name;
    this.connectionString = data.connectionString;
    this.accountName = data.accountName;
    this.accountKey = data.accountKey;
    this.sharedAccessSignature = data.sharedAccessSignature;
    this.blobEndpoint = data.blobEndpoint;
    this.endpointSuffix = data.endpointSuffix;
  }

  /**
   * @internal
   */
  static override _toHttpData(data: IAzureExternalAnalyticsLink): any {
    let dvSpecific;
    if (data.dataverse.indexOf('/') !== -1) {
      const encDataverse = encodeURIComponent(data.dataverse);
      const encName = encodeURIComponent(data.name);
      dvSpecific = {
        httpPath: `/analytics/link/${encDataverse}/${encName}`,
      };
    } else {
      dvSpecific = {
        httpPath: `/analytics/link`,
        dataverse: data.dataverse,
        name: data.name,
      };
    }

    return {
      type: 'azure',
      ...dvSpecific,
      connectionString: data.connectionString,
      accountName: data.accountName,
      accountKey: data.accountKey,
      sharedAccessSignature: data.sharedAccessSignature,
      blobEndpoint: data.blobEndpoint,
      endpointSuffix: data.endpointSuffix,
    };
  }

  /**
   * @internal
   */
  static override _fromHttpData(data: Record<string, any>): AzureExternalAnalyticsLink {
    return new AzureExternalAnalyticsLink({
      linkType: AnalyticsLinkType.AzureBlobExternal,
      dataverse: data.dataverse ?? data.scope,
      name: data.name,
      connectionString: undefined,
      accountName: data.accountName,
      accountKey: undefined,
      sharedAccessSignature: undefined,
      blobEndpoint: data.blobEndpoint,
      endpointSuffix: data.endpointSuffix,
    });
  }
}

/**
 * @category Management
 */
export interface CreateAnalyticsDataverseOptions {
  /**
   * Whether or not the call should ignore the dataverse already existing when
   * determining whether the call was successful.
   */
  ignoreIfExists?: boolean;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropAnalyticsDataverseOptions {
  /**
   * Whether or not the call should ignore the dataverse not existing when
   * determining whether the call was successful.
   */
  ignoreIfNotExists?: boolean;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface CreateAnalyticsDatasetOptions {
  /**
   * Whether or not the call should ignore the dataset already existing when
   * determining whether the call was successful.
   */
  ignoreIfExists?: boolean;

  /**
   * The name of the dataverse the dataset should belong to.
   */
  dataverseName?: string;

  /**
   * A conditional expression to limit the indexes scope.
   */
  condition?: string;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropAnalyticsDatasetOptions {
  /**
   * Whether or not the call should ignore the dataset already existing when
   * determining whether the call was successful.
   */
  ignoreIfNotExists?: boolean;

  /**
   * The name of the dataverse the dataset belongs to.
   */
  dataverseName?: string;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetAllAnalyticsDatasetsOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface CreateAnalyticsIndexOptions {
  /**
   * Whether or not the call should ignore the dataverse not existing when
   * determining whether the call was successful.
   */
  ignoreIfExists?: boolean;

  /**
   * The name of the dataverse the index should belong to.
   */
  dataverseName?: string;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropAnalyticsIndexOptions {
  /**
   * Whether or not the call should ignore the index already existing when
   * determining whether the call was successful.
   */
  ignoreIfNotExists?: boolean;

  /**
   * The name of the dataverse the index belongs to.
   */
  dataverseName?: string;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetAllAnalyticsIndexesOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface ConnectAnalyticsLinkOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DisconnectAnalyticsLinkOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetPendingAnalyticsMutationsOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface CreateAnalyticsLinkOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface ReplaceAnalyticsLinkOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropAnalyticsLinkOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetAllAnalyticsLinksOptions {
  /**
   * The name of a dataverse to filter the links list to.
   */
  dataverse?: string;

  /**
   * The name of a specific link to fetch.
   */
  name?: string;

  /**
   * The type of link to filter the links list to.
   */
  linkType?: AnalyticsLinkType;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * AnalyticsIndexManager provides an interface for performing management
 * operations against the analytics service of the cluster.
 *
 * @category Management
 */
export class AnalyticsIndexManager<
  T extends CouchbaseClusterTypes = CouchbaseClusterTypes,
> {
  private _cluster: Cluster<T>;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>) {
    this._cluster = cluster;
  }

  private get _http() {
    return new HttpExecutor(this._cluster.conn);
  }

  /**
   * Creates a new dataverse.
   *
   * @param dataverseName The name of the dataverse to create.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async createDataverse(
    dataverseName: string,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async createDataverse(
    dataverseName: string,
    options: CreateAnalyticsDataverseOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async createDataverse(
    dataverseName: string,
    options?: CreateAnalyticsDataverseOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    let qs = '';

    qs += 'CREATE DATAVERSE';

    qs += ' `' + dataverseName.split('/').join('`.`') + '`';

    if (options.ignoreIfExists) {
      qs += ' IF NOT EXISTS';
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      try {
        await this._cluster.analyticsQuery(qs, {
          timeout: timeout,
        });
      } catch (err) {
        if (err instanceof DataverseExistsError) {
          throw err;
        }

        throw new CouchbaseError('failed to create dataverse', err as Error);
      }
    }, callback);
  }

  /**
   * Drops a previously created dataverse.
   *
   * @param dataverseName The name of the dataverse to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropDataverse(dataverseName: string, callback?: VoidNodeCallback): Promise<void>;
  async dropDataverse(
    dataverseName: string,
    options: DropAnalyticsDataverseOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropDataverse(
    dataverseName: string,
    options?: DropAnalyticsDataverseOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    let qs = '';

    qs += 'DROP DATAVERSE';

    qs += ' `' + dataverseName.split('/').join('`.`') + '`';

    if (options.ignoreIfNotExists) {
      qs += ' IF EXISTS';
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      try {
        await this._cluster.analyticsQuery(qs, {
          timeout: timeout,
        });
      } catch (err) {
        if (err instanceof DataverseNotFoundError) {
          throw err;
        }

        throw new CouchbaseError('failed to drop dataverse', err as Error);
      }
    }, callback);
  }

  /**
   * Creates a new dataset.
   *
   * @param bucketName The name of the bucket to create this dataset of.
   * @param datasetName The name of the new dataset.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async createDataset(
    bucketName: string,
    datasetName: string,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async createDataset(
    bucketName: string,
    datasetName: string,
    options: CreateAnalyticsDatasetOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async createDataset(
    bucketName: string,
    datasetName: string,
    options?: CreateAnalyticsDatasetOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    let qs = '';

    qs += 'CREATE DATASET';

    if (options.ignoreIfExists) {
      qs += ' IF NOT EXISTS';
    }

    if (options.dataverseName) {
      qs +=
        ' `' + options.dataverseName.split('/').join('`.`') + '`.`' + datasetName + '`';
    } else {
      qs += ' `' + datasetName + '`';
    }

    qs += ' ON `' + bucketName + '`';

    if (options.condition) {
      qs += ' WHERE ' + options.condition;
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      try {
        await this._cluster.analyticsQuery(qs, {
          timeout: timeout,
        });
      } catch (err) {
        if (err instanceof DatasetExistsError) {
          throw err;
        }

        throw new CouchbaseError('failed to create dataset', err as Error);
      }
    }, callback);
  }

  /**
   * Drops a previously created dataset.
   *
   * @param datasetName The name of the dataset to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropDataset(datasetName: string, callback?: VoidNodeCallback): Promise<void>;
  async dropDataset(
    datasetName: string,
    options: DropAnalyticsDatasetOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropDataset(
    datasetName: string,
    options?: DropAnalyticsDatasetOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    let qs = '';

    qs += 'DROP DATASET';

    if (options.dataverseName) {
      qs +=
        ' `' + options.dataverseName.split('/').join('`.`') + '`.`' + datasetName + '`';
    } else {
      qs += ' `' + datasetName + '`';
    }

    if (options.ignoreIfNotExists) {
      qs += ' IF EXISTS';
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      try {
        await this._cluster.analyticsQuery(qs, {
          timeout: timeout,
        });
      } catch (err) {
        if (err instanceof DatasetNotFoundError) {
          throw err;
        }

        throw new CouchbaseError('failed to drop dataset', err as Error);
      }
    }, callback);
  }

  /**
   * Returns a list of all existing datasets.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllDatasets(
    callback?: NodeCallback<AnalyticsDataset[]>
  ): Promise<AnalyticsDataset[]>;
  async getAllDatasets(
    options: GetAllAnalyticsDatasetsOptions,
    callback?: NodeCallback<AnalyticsDataset[]>
  ): Promise<AnalyticsDataset[]>;
  async getAllDatasets(
    options?: GetAllAnalyticsDatasetsOptions | NodeCallback<AnalyticsDataset[]>,
    callback?: NodeCallback<AnalyticsDataset[]>
  ): Promise<AnalyticsDataset[]> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const qs =
      'SELECT d.* FROM `Metadata`.`Dataset` d WHERE d.DataverseName <> "Metadata"';

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = (await this._cluster.analyticsQuery(qs, {
        timeout: timeout,
      })) as {
        rows: Array<{
          DatasetName: string;
          DataverseName: string;
          LinkName: string;
          BucketName: string;
        }>;
      };

      return res.rows.map(
        (row) =>
          new AnalyticsDataset({
            name: row.DatasetName,
            dataverseName: row.DataverseName,
            linkName: row.LinkName,
            bucketName: row.BucketName,
          })
      );
    }, callback);
  }

  /**
   * Creates a new index.
   *
   * @param datasetName The name of the dataset to create this index on.
   * @param indexName The name of index to create.
   * @param fields A map of fields that the index should contain.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async createIndex(
    datasetName: string,
    indexName: string,
    fields: { [key: string]: string },
    callback?: VoidNodeCallback
  ): Promise<void>;
  async createIndex(
    datasetName: string,
    indexName: string,
    fields: { [key: string]: string },
    options: CreateAnalyticsIndexOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async createIndex(
    datasetName: string,
    indexName: string,
    fields: { [key: string]: string },
    options?: CreateAnalyticsIndexOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    let qs = '';

    qs += 'CREATE INDEX';

    qs += ' `' + indexName + '`';

    if (options.ignoreIfExists) {
      qs += ' IF NOT EXISTS';
    }

    if (options.dataverseName) {
      qs +=
        ' ON `' +
        options.dataverseName.split('/').join('`.`') +
        '`.`' +
        datasetName +
        '`';
    } else {
      qs += ' ON `' + datasetName + '`';
    }

    qs += ' (';

    qs += Object.keys(fields)
      .map((i) => '`' + i + '`: ' + fields[i])
      .join(', ');

    qs += ')';

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      await this._cluster.analyticsQuery(qs, {
        timeout: timeout,
      });
    }, callback);
  }

  /**
   * Drops a previously created index.
   *
   * @param datasetName The name of the dataset containing the index to drop.
   * @param indexName The name of the index to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropIndex(
    datasetName: string,
    indexName: string,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropIndex(
    datasetName: string,
    indexName: string,
    options: DropAnalyticsIndexOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropIndex(
    datasetName: string,
    indexName: string,
    options?: DropAnalyticsIndexOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    let qs = '';

    qs += 'DROP INDEX';

    if (options.dataverseName) {
      qs +=
        ' `' + options.dataverseName.split('/').join('`.`') + '`.`' + datasetName + '`';
    } else {
      qs += ' `' + datasetName + '`';
    }
    qs += '.`' + indexName + '`';

    if (options.ignoreIfNotExists) {
      qs += ' IF EXISTS';
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      await this._cluster.analyticsQuery(qs, {
        timeout: timeout,
      });
    }, callback);
  }

  /**
   * Returns a list of all existing indexes.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllIndexes(
    callback?: NodeCallback<AnalyticsIndex[]>
  ): Promise<AnalyticsIndex[]>;
  async getAllIndexes(
    options: GetAllAnalyticsIndexesOptions,
    callback?: NodeCallback<AnalyticsIndex[]>
  ): Promise<AnalyticsIndex[]>;
  async getAllIndexes(
    options?: GetAllAnalyticsIndexesOptions | NodeCallback<AnalyticsIndex[]>,
    callback?: NodeCallback<AnalyticsIndex[]>
  ): Promise<AnalyticsIndex[]> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const qs = 'SELECT d.* FROM `Metadata`.`Index` d WHERE d.DataverseName <> "Metadata"';

    const timeout = options.timeout ?? this._cluster.managementTimeout;
    return PromiseHelper.wrapAsync(async () => {
      const res = (await this._cluster.analyticsQuery(qs, {
        timeout: timeout,
      })) as {
        rows: Array<{
          IndexName: string;
          DatasetName: string;
          DataverseName: string;
          IsPrimary: boolean;
        }>;
      };

      return res.rows.map(
        (row) =>
          new AnalyticsIndex({
            name: row.IndexName,
            datasetName: row.DatasetName,
            dataverseName: row.DataverseName,
            isPrimary: row.IsPrimary,
          })
      );
    }, callback);
  }

  /**
   * Connects a not yet connected link.
   *
   * @param linkName The name of the link to connect.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async connectLink(linkName: string, callback?: VoidNodeCallback): Promise<void>;
  async connectLink(
    linkName: string,
    options: ConnectAnalyticsLinkOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async connectLink(
    linkName: string,
    options?: ConnectAnalyticsLinkOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const qs = `CONNECT LINK ${linkName}`;

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      await this._cluster.analyticsQuery(qs, {
        timeout: timeout,
      });
    }, callback);
  }

  /**
   * Disconnects a previously connected link.
   *
   * @param linkName The name of the link to disconnect.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async disconnectLink(linkName: string, callback?: VoidNodeCallback): Promise<void>;
  async disconnectLink(
    linkName: string,
    options: DisconnectAnalyticsLinkOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async disconnectLink(
    linkName: string,
    options?: DisconnectAnalyticsLinkOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const qs = 'DISCONNECT LINK ' + linkName;

    const timeout = options.timeout ?? this._cluster.managementTimeout;
    return PromiseHelper.wrapAsync(async () => {
      await this._cluster.analyticsQuery(qs, {
        timeout: timeout,
      });
    }, callback);
  }

  /**
   * Returns a list of all pending mutations.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getPendingMutations(
    callback?: NodeCallback<{ [k: string]: { [k: string]: number } }>
  ): Promise<{ [k: string]: { [k: string]: number } }>;
  async getPendingMutations(
    options: GetPendingAnalyticsMutationsOptions,
    callback?: NodeCallback<{ [k: string]: { [k: string]: number } }>
  ): Promise<{ [k: string]: { [k: string]: number } }>;
  async getPendingMutations(
    options?:
      | GetPendingAnalyticsMutationsOptions
      | NodeCallback<{ [k: string]: { [k: string]: number } }>,
    callback?: NodeCallback<{ [k: string]: { [k: string]: number } }>
  ): Promise<{ [k: string]: { [k: string]: number } }> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Analytics,
        method: HttpMethod.Get,
        path: `/analytics/node/agg/stats/remaining`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        throw new CouchbaseError('failed to get pending mutations', undefined, errCtx);
      }

      return JSON.parse(res.body.toString());
    }, callback);
  }

  /**
   * Creates a new analytics remote link.
   *
   * @param link The settings for the link to create.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async createLink(
    link: ApiAnalyticsLink,
    options: CreateAnalyticsLinkOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;

  /**
   * Creates a new analytics remote link.
   *
   * @param link The settings for the link to create.
   * @param callback A node-style callback to be invoked after execution.
   */
  async createLink(link: ApiAnalyticsLink, callback?: VoidNodeCallback): Promise<void>;

  async createLink(
    link: ApiAnalyticsLink,
    ...args: [CreateAnalyticsLinkOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const { scope, dataverse, name, ...rest } = link as {
      scope: string;
      dataverse?: string;
      name: string;
    };

    const resolvedScope = scope ?? dataverse;
    const encodedScope = encodeURIComponent(resolvedScope);

    const body = cbQsStringify({
      ...rest,
      name,
      scope: resolvedScope,
    });

    try {
      const res = await this._http.request({
        type: HttpServiceType.Analytics,
        method: HttpMethod.Post,
        path: `/analytics/link/${encodedScope}/${name}`,
        contentType: 'application/x-www-form-urlencoded',
        body,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        const errText = res.body.toString().toLowerCase();
        if (errText.includes('24055')) {
          throw new LinkExistsError(undefined, errCtx);
        } else if (errText.includes('24034')) {
          throw new DataverseNotFoundError(undefined, errCtx);
        }

        throw new CouchbaseError('failed to create link', undefined, errCtx);
      }

      if (callback) {
        callback(null);
      }
    } catch (err) {
      if (callback) {
        callback(err as Error);
        return;
      }

      throw err;
    }
  }

  /**
   * Replaces an existing analytics remote link.
   *
   * @param link The settings for the updated link.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async replaceLink(
    link: Omit<ApiAnalyticsLink, 'type'>,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async replaceLink(
    link: Omit<ApiAnalyticsLink, 'type'>,
    options: ReplaceAnalyticsLinkOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async replaceLink(
    link: Omit<ApiAnalyticsLink, 'type'>,
    ...args: [ReplaceAnalyticsLinkOptions, VoidNodeCallback?] | [VoidNodeCallback?]
  ): Promise<void> {
    const [options = {}, callback] = resolveOptionsAndCallback(args);

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    const { scope, dataverse, name, ...rest } = link as {
      scope: string;
      dataverse?: string;
      name: string;
    };

    const resolvedScope = scope ?? dataverse;
    const encodedScope = encodeURIComponent(resolvedScope);

    const body = cbQsStringify({
      ...rest,
      name,
      scope: resolvedScope,
    });

    try {
      const res = await this._http.request({
        type: HttpServiceType.Analytics,
        method: HttpMethod.Put,
        path: `/analytics/link/${encodedScope}/${name}`,
        contentType: 'application/x-www-form-urlencoded',
        body,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        const errText = res.body.toString().toLowerCase();
        if (errText.includes('24055')) {
          throw new LinkExistsError(undefined, errCtx);
        } else if (errText.includes('24034')) {
          throw new DataverseNotFoundError(undefined, errCtx);
        }

        throw new CouchbaseError('failed to replace the link', undefined, errCtx);
      }

      if (callback) {
        callback(null);
      }
    } catch (err) {
      if (callback) {
        callback(err as Error);
        return;
      }

      throw err;
    }
  }

  /**
   * Drops an existing analytics remote link.
   *
   * @param linkName The name of the link to drop.
   * @param dataverseName The dataverse containing the link to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropLink(
    linkName: string,
    dataverseName: string,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropLink(
    linkName: string,
    dataverseName: string,
    options: DropAnalyticsLinkOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropLink(
    linkName: string,
    dataverseName: string,
    options?: DropAnalyticsLinkOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      let httpPath;
      let httpParams;
      if (dataverseName.indexOf('/') !== -1) {
        const encDataverse = encodeURIComponent(dataverseName);
        const encName = encodeURIComponent(linkName);
        httpPath = `/analytics/link/${encDataverse}/${encName}`;
        httpParams = {};
      } else {
        httpPath = `/analytics/link`;
        httpParams = {
          dataverse: dataverseName,
          name: linkName,
        };
      }
      const res = await this._http.request({
        type: HttpServiceType.Analytics,
        method: HttpMethod.Delete,
        path: httpPath,
        contentType: 'application/x-www-form-urlencoded',
        body: cbQsStringify(httpParams),
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        const errText = res.body.toString().toLowerCase();
        if (errText.includes('24055')) {
          throw new LinkExistsError(undefined, errCtx);
        } else if (errText.includes('24034')) {
          throw new DataverseNotFoundError(undefined, errCtx);
        }

        throw new CouchbaseError('failed to delete link', undefined, errCtx);
      }
    }, callback);
  }

  /**
   * Returns a list of existing analytics remote links.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllLinks(callback?: NodeCallback<AnalyticsLink[]>): Promise<AnalyticsLink[]>;
  async getAllLinks(
    options: GetAllAnalyticsLinksOptions,
    callback?: NodeCallback<AnalyticsLink[]>
  ): Promise<AnalyticsLink[]>;
  async getAllLinks(
    options?: GetAllAnalyticsLinksOptions | NodeCallback<AnalyticsLink[]>,
    callback?: NodeCallback<AnalyticsLink[]>
  ): Promise<AnalyticsLink[]> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const dataverseName = options.dataverse;
    const linkName = options.name;
    const linkType = options.linkType;
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      let httpPath;
      if (dataverseName && dataverseName.indexOf('/') !== -1) {
        const encDataverse = encodeURIComponent(dataverseName);
        httpPath = `/analytics/link/${encDataverse}`;

        if (linkName) {
          const encName = encodeURIComponent(linkName);
          httpPath += `/${encName}`;
        }

        httpPath += '?';

        if (linkType) {
          httpPath += `type=${linkType}&`;
        }
      } else {
        httpPath = `/analytics/link?`;

        if (dataverseName) {
          httpPath += `dataverse=${dataverseName}&`;

          if (linkName) {
            httpPath += `dataverse=${linkName}&`;
          }
        }

        if (linkType) {
          httpPath += `type=${linkType}&`;
        }
      }

      const res = await this._http.request({
        type: HttpServiceType.Analytics,
        method: HttpMethod.Get,
        path: httpPath,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        const errText = res.body.toString().toLowerCase();
        if (errText.includes('24034')) {
          throw new DataverseNotFoundError(undefined, errCtx);
        }

        throw new CouchbaseError('failed to get links', undefined, errCtx);
      }

      const linksData = JSON.parse(res.body.toString()) as Array<{
        type: 'couchbase' | 's3' | 'azure';
      }>;
      const links = linksData.map((linkData) => AnalyticsLink._fromHttpData(linkData));

      return links;
    }, callback);
  }
}
