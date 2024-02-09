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
import {
  ApiRole,
  ApiUser,
  ApiUserGroup,
  ApiUserRole,
  ApiUserRoleOrigin,
} from '@cbjs/http-client';
import { getRoleScope, RoleName } from '@cbjs/shared';

import { Cluster } from './cluster';
import { CouchbaseError, GroupNotFoundError, UserNotFoundError } from './errors';
import { HttpExecutor, HttpMethod, HttpServiceType } from './httpexecutor';
import {
  cbQsStringify,
  NodeCallback,
  PromiseHelper,
  VoidNodeCallback,
} from './utilities';

/**
 * Contains information about an origin for a role.
 *
 * @category Management
 */
export class Origin {
  /**
   * The type of this origin.
   */
  type: string;

  /**
   * The name of this origin.
   */
  name?: string;

  /**
   * @internal
   */
  constructor(data: Origin) {
    this.type = data.type;
    this.name = data.name;
  }

  /**
   * @internal
   */
  static _fromNsData(data: ApiUserRoleOrigin): Origin {
    return new Origin({
      type: data.type,
      name: data.name,
    });
  }
}

/**
 * Contains information about a role.
 *
 * @category Management
 */
export class Role {
  /**
   * The name of the role.
   */
  name: RoleName;

  /**
   * The bucket this role applies to.
   */
  bucket: string | undefined;

  /**
   * The scope this role applies to.
   */
  scope: string | undefined;

  /**
   * The collection this role applies to.
   */
  collection: string | undefined;

  /**
   * @internal
   */
  constructor(data: Role) {
    this.name = data.name;
    this.bucket = data.bucket;
    this.scope = data.scope;
    this.collection = data.collection;
  }

  /**
   * @internal
   */
  static _fromNsData(data: ApiUserRole): Role {
    return new Role({
      name: data.role,
      ...getRoleScope(data),
    });
  }

  /**
   * @internal
   */
  static _toNsStr(role: string | Role): string {
    if (typeof role === 'string') {
      return role;
    }

    if (role.bucket && role.scope && role.collection) {
      return `${role.name}[${role.bucket}:${role.scope}:${role.collection}]`;
    } else if (role.bucket && role.scope) {
      return `${role.name}[${role.bucket}:${role.scope}]`;
    } else if (role.bucket) {
      return `${role.name}[${role.bucket}]`;
    } else {
      return role.name;
    }
  }

  toString(role: string | Role) {
    return Role._toNsStr(this);
  }
}

/**
 * Contains information about a role along with its description.
 *
 * @category Management
 */
export class RoleAndDescription extends Role {
  /**
   * The user-friendly display name for this role.
   */
  displayName: string;

  /**
   * The description of this role.
   */
  description: string;

  /**
   * @internal
   */
  constructor(data: RoleAndDescription) {
    super(data);
    this.displayName = data.displayName;
    this.description = data.description;
  }

  /**
   * @internal
   * @deprecated
   */
  static override _fromNsData(data: ApiRole): RoleAndDescription {
    return new RoleAndDescription({
      ...Role._fromNsData(data),
      displayName: data.name,
      description: data.desc,
    });
  }
}

/**
 * Contains information about a role along with its origin.
 *
 * @category Management
 */
export class RoleAndOrigin extends Role {
  /**
   * The origins for this role.
   */
  origins: Origin[];

  /**
   * @internal
   */
  constructor(data: RoleAndOrigin) {
    super(data);
    this.origins = data.origins;
  }

  /**
   * @internal
   */
  static override _fromNsData(data: ApiUserRole): RoleAndOrigin {
    const origins =
      data.origins?.map((originData: any) => Origin._fromNsData(originData)) ?? [];

    return new RoleAndOrigin({
      ...Role._fromNsData(data),
      origins,
    });
  }
}

/**
 * Specifies information about a user.
 *
 * @category Management
 */
export interface IUser {
  /**
   * The username of the user.
   */
  username: string;

  /**
   * The display name of the user.
   */
  displayName?: string;

  /**
   * The groups associated with this user.
   */
  groups?: string[];

  /**
   * The roles associates with this user.
   */
  roles?: (Role | string)[];

  /**
   * The password for this user.
   */
  password?: string;
}

/**
 * Contains information about a user.
 *
 * @category Management
 */
export class User implements IUser {
  /**
   * The username of the user.
   */
  username: string;

  /**
   * The display name of the user.
   */
  displayName: string;

  /**
   * The groups associated with this user.
   */
  groups: string[];

  /**
   * The roles associates with this user.
   */
  roles: Role[];

  /**
   * This is never populated in a result returned by the server.
   */
  password: undefined;

  /**
   * @internal
   */
  constructor(data: User) {
    this.username = data.username;
    this.displayName = data.displayName;
    this.groups = data.groups;
    this.roles = data.roles;
  }

  /**
   * @internal
   */
  static _fromNsData(data: ApiUser): User {
    const roles = data.roles
      .filter((roleData) => {
        // Check whether or not this role has originated from the user directly
        // or whether it was through a group.
        return !!roleData.origins?.find((originData) => originData.type === 'user');
      })
      .map((roleData) => Role._fromNsData(roleData));

    return new User({
      username: data.id,
      displayName: data.name,
      groups: data.groups,
      roles: roles,
      password: undefined,
    });
  }

  /**
   * Used to upsert a user
   * @internal
   * @deprecated
   */
  static _toNsData(user: IUser) {
    return {
      name: user.displayName,
      groups: user.groups,
      password: user.password,
      roles: user.roles?.map((role) => Role._toNsStr(role)).join(','),
    };
  }
}

/**
 * Contains information about a user along with some additional meta-data
 * about that user.
 *
 * @category Management
 */
export class UserAndMetadata extends User {
  /**
   * The domain this user is part of.
   */
  domain: string;

  /**
   * The effective roles that are associated with this user.
   */
  effectiveRoles: RoleAndOrigin[];

  /**
   * The last time the users password was changed.
   */
  passwordChanged: Date;

  /**
   * The external groups that this user is associated with.
   */
  externalGroups: string[];

  /**
   * Same as {@link effectiveRoles}, which already contains the roles
   * including their origins.
   *
   * @deprecated Use {@link effectiveRoles} instead.
   */
  get effectiveRolesAndOrigins(): RoleAndOrigin[] {
    return this.effectiveRoles;
  }

  /**
   * @internal
   */
  constructor(data: UserAndMetadata) {
    super(data);
    this.domain = data.domain;
    this.effectiveRoles = data.effectiveRoles;
    this.passwordChanged = data.passwordChanged;
    this.externalGroups = data.externalGroups;
  }

  /**
   * @internal
   */
  static override _fromNsData(data: ApiUser): UserAndMetadata {
    const effectiveRoles = data.roles.map((roleData) =>
      RoleAndOrigin._fromNsData(roleData)
    );

    return new UserAndMetadata({
      ...User._fromNsData(data),
      domain: data.domain,
      effectiveRoles: effectiveRoles,
      effectiveRolesAndOrigins: effectiveRoles,
      passwordChanged: new Date(data.password_change_date),
      externalGroups: data.external_groups,
    });
  }
}

/**
 * Specifies information about a group.
 *
 * @category Management
 */
export interface IGroup {
  /**
   * The name of the group.
   */
  name: string;

  /**
   * The description for the group.
   */
  description?: string;

  /**
   * The roles which are associated with this group.
   */
  roles?: (Role | string)[];

  /**
   * The LDAP group that this group is associated with.
   */
  ldapGroupReference?: string;
}

/**
 * Contains information about a group.
 *
 * @category Management
 */
export class Group {
  /**
   * The name of the group.
   */
  name: string;

  /**
   * The description for the group.
   */
  description: string;

  /**
   * The roles which are associated with this group.
   */
  roles: Role[];

  /**
   * The LDAP group that this group is associated with.
   */
  ldapGroupReference: string | undefined;

  /**
   * @internal
   */
  constructor(data: Group) {
    this.name = data.name;
    this.description = data.description;
    this.roles = data.roles;
    this.ldapGroupReference = data.ldapGroupReference;
  }

  /**
   * @internal
   */
  static _fromNsData(data: ApiUserGroup): Group {
    const roles =
      data.roles?.map(
        (roleData) =>
          new Role({
            name: roleData.role,
            ...getRoleScope(roleData),
          })
      ) ?? [];

    return new Group({
      name: data.id,
      description: data.description,
      roles: roles,
      ldapGroupReference: data.ldap_group_reference,
    });
  }

  /**
   * @internal
   */
  static _toNsData(group: IGroup) {
    const roles = group.roles?.map((role) => Role._toNsStr(role)).join(',');

    return {
      description: group.description ?? '',
      roles: roles,
      ldap_group_reference: group.ldapGroupReference,
    };
  }
}

/**
 * @category Management
 */
export interface GetUserOptions {
  /**
   * The domain to look in for the user.
   */
  domainName?: string;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetAllUsersOptions {
  /**
   * The domain to look in for users.
   */
  domainName?: string;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface UpsertUserOptions {
  /**
   * The domain to upsert the user within.
   */
  domainName?: string;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface ChangePasswordOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropUserOptions {
  /**
   * The domain to drop the user from.
   */
  domainName?: string;

  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetRolesOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetGroupOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface GetAllGroupsOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface UpsertGroupOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * @category Management
 */
export interface DropGroupOptions {
  /**
   * The timeout for this operation, represented in milliseconds.
   */
  timeout?: number;
}

/**
 * UserManager is an interface which enables the management of users,
 * groups and roles for the cluster.
 *
 * @category Management
 */
export class UserManager {
  private _cluster: Cluster;

  /**
   * @internal
   */
  constructor(cluster: Cluster) {
    this._cluster = cluster;
  }

  private get _http() {
    return new HttpExecutor(this._cluster.conn);
  }

  /**
   * Returns a specific user by their username.
   *
   * @param username The username of the user to fetch.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getUser(
    username: string,
    callback?: NodeCallback<UserAndMetadata>
  ): Promise<UserAndMetadata>;
  async getUser(
    username: string,
    options: GetUserOptions,
    callback?: NodeCallback<UserAndMetadata>
  ): Promise<UserAndMetadata>;
  async getUser(
    username: string,
    options?: GetUserOptions | NodeCallback<UserAndMetadata>,
    callback?: NodeCallback<UserAndMetadata>
  ): Promise<UserAndMetadata> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const domainName = options.domainName ?? 'local';
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Management,
        method: HttpMethod.Get,
        path: `/settings/rbac/users/${domainName}/${username}`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        if (res.statusCode === 404) {
          throw new UserNotFoundError(undefined, errCtx);
        }

        throw new CouchbaseError('failed to get the user', undefined, errCtx);
      }

      const userData = JSON.parse(res.body.toString()) as ApiUser;
      return UserAndMetadata._fromNsData(userData);
    }, callback);
  }

  /**
   * Returns a list of all existing users.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllUsers(
    callback?: NodeCallback<UserAndMetadata[]>
  ): Promise<UserAndMetadata[]>;
  async getAllUsers(
    options: GetAllUsersOptions,
    callback?: NodeCallback<UserAndMetadata[]>
  ): Promise<UserAndMetadata[]>;
  async getAllUsers(
    options?: GetAllUsersOptions | NodeCallback<UserAndMetadata[]>,
    callback?: NodeCallback<UserAndMetadata[]>
  ): Promise<UserAndMetadata[]> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const domainName = options.domainName ?? 'local';
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Management,
        method: HttpMethod.Get,
        path: `/settings/rbac/users/${domainName}`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        throw new CouchbaseError('failed to get users', undefined, errCtx);
      }

      const usersData = JSON.parse(res.body.toString()) as ApiUser[];
      return usersData.map((userData) => UserAndMetadata._fromNsData(userData));
    }, callback);
  }

  /**
   * Creates or updates an existing user.
   *
   * @param user The user to update.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async upsertUser(user: IUser, callback?: VoidNodeCallback): Promise<void>;
  async upsertUser(
    user: IUser,
    options: UpsertUserOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async upsertUser(
    user: IUser,
    options?: UpsertUserOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const domainName = options.domainName ?? 'local';
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const roles = user.roles?.map((role) => Role._toNsStr(role)).join(',');

      const userData = {
        name: user.displayName,
        groups: user.groups,
        password: user.password,
        roles: roles,
      };

      const res = await this._http.request({
        type: HttpServiceType.Management,
        method: HttpMethod.Put,
        path: `/settings/rbac/users/${domainName}/${user.username}`,
        contentType: 'application/x-www-form-urlencoded',
        body: cbQsStringify(userData),
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        throw new CouchbaseError('failed to upsert user', undefined, errCtx);
      }
    }, callback);
  }

  /**
   * Change password for the currently authenticatd user.
   *
   * @param newPassword The new password to be applied.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async changePassword(newPassword: string, callback?: VoidNodeCallback): Promise<void>;
  async changePassword(
    newPassword: string,
    options: ChangePasswordOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async changePassword(
    newPassword: string,
    options?: ChangePasswordOptions | VoidNodeCallback,
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
      const passwordData = { password: newPassword };

      const res = await this._http.request({
        type: HttpServiceType.Management,
        method: HttpMethod.Post,
        path: `/controller/changePassword`,
        contentType: 'application/x-www-form-urlencoded',
        body: cbQsStringify(passwordData),
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        if (res.statusCode === 404) {
          throw new UserNotFoundError(undefined, errCtx);
        }

        throw new CouchbaseError(
          'failed to change password for the current user',
          undefined,
          errCtx
        );
      }
    }, callback);
  }

  /**
   * Drops an existing user.
   *
   * @param username The username of the user to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropUser(username: string, callback?: VoidNodeCallback): Promise<void>;
  async dropUser(
    username: string,
    options: DropUserOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropUser(
    username: string,
    options?: DropUserOptions | VoidNodeCallback,
    callback?: VoidNodeCallback
  ): Promise<void> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const domainName = options.domainName ?? 'local';
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrapAsync(async () => {
      const res = await this._http.request({
        type: HttpServiceType.Management,
        method: HttpMethod.Delete,
        path: `/settings/rbac/users/${domainName}/${username}`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        if (res.statusCode === 404) {
          throw new UserNotFoundError(undefined, errCtx);
        }

        throw new CouchbaseError('failed to drop the user', undefined, errCtx);
      }
    }, callback);
  }

  /**
   * Returns a list of roles available on the server.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getRoles(callback?: NodeCallback<Role[]>): Promise<Role[]>;
  async getRoles(
    options: GetRolesOptions,
    callback?: NodeCallback<Role[]>
  ): Promise<Role[]>;
  async getRoles(
    options?: GetRolesOptions | NodeCallback<Role[]>,
    callback?: NodeCallback<Role[]>
  ): Promise<Role[]> {
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
        type: HttpServiceType.Management,
        method: HttpMethod.Get,
        path: `/settings/rbac/roles`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        throw new CouchbaseError('failed to get roles', undefined, errCtx);
      }

      const rolesData = JSON.parse(res.body.toString()) as ApiRole[];
      return rolesData.map(
        (roleData) =>
          new RoleAndDescription({
            name: roleData.role,
            displayName: roleData.name,
            description: roleData.desc,
            ...getRoleScope(roleData),
          })
      );
    }, callback);
  }

  /**
   * Returns a group by it's name.
   *
   * @param groupName The name of the group to retrieve.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getGroup(groupName: string, callback?: NodeCallback<Group>): Promise<Group>;
  async getGroup(
    groupName: string,
    options: GetGroupOptions,
    callback?: NodeCallback<Group>
  ): Promise<Group>;
  async getGroup(
    groupName: string,
    options?: GetGroupOptions | NodeCallback<Group>,
    callback?: NodeCallback<Group>
  ): Promise<Group> {
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
        type: HttpServiceType.Management,
        method: HttpMethod.Get,
        path: `/settings/rbac/groups/${groupName}`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        if (res.statusCode === 404) {
          throw new GroupNotFoundError(undefined, errCtx);
        }

        throw new CouchbaseError('failed to get the group', undefined, errCtx);
      }

      const groupData = JSON.parse(res.body.toString());
      return Group._fromNsData(groupData);
    }, callback);
  }

  /**
   * Returns a list of all existing groups.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getAllGroups(callback?: NodeCallback<Group[]>): Promise<Group[]>;
  async getAllGroups(
    options: GetAllGroupsOptions,
    callback?: NodeCallback<Group[]>
  ): Promise<Group[]>;
  async getAllGroups(
    options?: GetAllGroupsOptions | NodeCallback<Group[]>,
    callback?: NodeCallback<Group[]>
  ): Promise<Group[]> {
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
        type: HttpServiceType.Management,
        method: HttpMethod.Get,
        path: `/settings/rbac/groups`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        throw new CouchbaseError('failed to get groups', undefined, errCtx);
      }

      const groupsData = JSON.parse(res.body.toString()) as ApiUserGroup[];
      return groupsData.map((groupData) => Group._fromNsData(groupData));
    }, callback);
  }

  /**
   * Creates or updates an existing group.
   *
   * @param group The group to update.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async upsertGroup(group: IGroup, callback?: VoidNodeCallback): Promise<void>;
  async upsertGroup(
    group: IGroup,
    options: UpsertGroupOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async upsertGroup(
    group: IGroup,
    options?: UpsertGroupOptions | VoidNodeCallback,
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
      const groupData = Group._toNsData(group);

      const res = await this._http.request({
        type: HttpServiceType.Management,
        method: HttpMethod.Put,
        path: `/settings/rbac/groups/${group.name}`,
        contentType: 'application/x-www-form-urlencoded',
        body: cbQsStringify(groupData),
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        throw new CouchbaseError('failed to upsert group', undefined, errCtx);
      }
    }, callback);
  }

  /**
   * Drops an existing group.
   *
   * @param groupName The name of the group to drop.
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async dropGroup(groupName: string, callback?: VoidNodeCallback): Promise<void>;
  async dropGroup(
    groupName: string,
    options: DropGroupOptions,
    callback?: VoidNodeCallback
  ): Promise<void>;
  async dropGroup(
    groupName: string,
    options?: DropGroupOptions | VoidNodeCallback,
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
      const res = await this._http.request({
        type: HttpServiceType.Management,
        method: HttpMethod.Delete,
        path: `/settings/rbac/groups/${groupName}`,
        timeout: timeout,
      });

      if (res.statusCode !== 200) {
        const errCtx = HttpExecutor.errorContextFromResponse(res);

        if (res.statusCode === 404) {
          throw new GroupNotFoundError(undefined, errCtx);
        }

        throw new CouchbaseError('failed to drop the group', undefined, errCtx);
      }
    }, callback);
  }
}
