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
} from '@cbjsdev/http-client';
import {
  CouchbaseClusterTypes,
  getRoleScope,
  hasOwn,
  Pretty,
  RoleName,
  RoleScope,
} from '@cbjsdev/shared';

import {
  CppManagementRbacGroup,
  CppManagementRbacOrigin,
  CppManagementRbacRole,
  CppManagementRbacRoleAndDescription,
  CppManagementRbacRoleAndOrigins,
  CppManagementRbacUser,
  CppManagementRbacUserAndMetadata,
} from './binding.js';
import { authDomainFromCpp, authDomainToCpp, errorFromCpp } from './bindingutilities.js';
import { Cluster } from './cluster.js';
import { CouchbaseError, GroupNotFoundError, UserNotFoundError } from './errors.js';
import { HttpExecutor, HttpMethod, HttpServiceType } from './httpexecutor.js';
import {
  cbQsStringify,
  NodeCallback,
  PromiseHelper,
  VoidNodeCallback,
} from './utilities.js';

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
  static _fromCppData(data: CppManagementRbacOrigin): Origin {
    return new Origin({
      type: data.type,
      name: data.name,
    });
  }
}

export type SdkScopedRole = Pretty<
  {
    [key in RoleName]: {
      name: key;
    } & {
      [scope in RoleScope[key][number]]: string;
    };
  }[RoleName]
>;

// prettier-ignore
type AnyRole =
  SdkScopedRole extends infer AllScopedRoles ?
    AllScopedRoles extends infer ScopedRole extends SdkScopedRole ?
      Role<ScopedRole> :
    never :
  never
;

/**
 * Contains information about a role.
 *
 * @category Management
 */
export class Role<RoleDef extends SdkScopedRole = SdkScopedRole> {
  /**
   * The name of the role.
   */
  name: RoleDef['name'];

  /**
   * The bucket this role applies to.
   */
  bucket: 'bucket' extends keyof RoleDef ? RoleDef['bucket'] : never;

  /**
   * The scope this role applies to.
   */
  scope: 'scope' extends keyof RoleDef ? RoleDef['scope'] : never;

  /**
   * The collection this role applies to.
   */
  collection: 'collection' extends keyof RoleDef ? RoleDef['collection'] : never;

  /**
   * @internal
   */
  constructor(data: RoleDef) {
    this.name = data.name;
    this.bucket = (data as { bucket: string }).bucket as never;
    this.scope = (data as { scope: string }).scope as never;
    this.collection = (data as { collection: string }).collection as never;
  }

  /**
   * @internal
   */
  static _fromCppData(data: SdkScopedRole): Role {
    return new Role(data);
  }

  /**
   * @internal
   */
  static _toCppData(data: Role | SdkScopedRole): CppManagementRbacRole {
    const role = data as Role;

    return {
      name: role.name,
      bucket: role.bucket === '*' ? undefined : role.bucket,
      scope: role.scope === '*' ? undefined : role.scope,
      collection: role.collection === '*' ? undefined : role.collection,
    };
  }

  toString() {
    return Role._toCppData(this as Role);
  }
}

/**
 * Contains information about a role along with its description.
 *
 * @category Management
 */
export class RoleAndDescription<RoleDef extends SdkScopedRole> extends Role<RoleDef> {
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
  constructor(data: RoleDef & { description: string; displayName: string }) {
    super(data);
    this.displayName = data.displayName;
    this.description = data.description;
  }

  /**
   * @internal
   */
  static override _fromCppData<RoleDef extends SdkScopedRole>(
    data: RoleDef & { description: string; display_name: string }
  ): RoleAndDescription<RoleDef> {
    return new RoleAndDescription<RoleDef>({
      ...data,
      displayName: data.display_name,
    });
  }
}

/**
 * Contains information about a role along with its origin.
 *
 * @category Management
 */
export class RoleAndOrigin<RoleDef extends SdkScopedRole> extends Role<RoleDef> {
  /**
   * The origins for this role.
   */
  origins: Origin[];

  /**
   * @internal
   */
  constructor(data: RoleDef & { origins: CppManagementRbacOrigin[] }) {
    super(data);
    this.origins = data.origins;
  }

  /**
   * @internal
   */
  static override _fromCppData<RoleDef extends SdkScopedRole>(
    data: RoleDef & { origins: CppManagementRbacOrigin[] }
  ): RoleAndOrigin<RoleDef> {
    const origins =
      data.origins?.map((originData) => Origin._fromCppData(originData)) ?? [];

    return new RoleAndOrigin({
      ...data,
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
  roles?: (SdkScopedRole | AnyRole | string)[];

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
  displayName?: string;

  /**
   * The groups associated with this user.
   */
  groups: string[];

  /**
   * The roles associates with this user.
   */
  roles: AnyRole[];

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
  static _fromCppData(data: CppManagementRbacUser): User {
    return new User({
      username: data.username,
      displayName: data.display_name,
      groups: data.groups,
      roles: data.roles.map((role) =>
        Role._fromCppData(role as SdkScopedRole)
      ) as AnyRole[],
      password: undefined,
    });
  }

  /**
   * @internal
   */
  static _toCppData(data: IUser): CppManagementRbacUser {
    const roles: CppManagementRbacRole[] = [];
    if (data.roles) {
      data.roles.forEach((role) => {
        if (typeof role === 'string') {
          roles.push({
            name: role,
          });
        } else {
          roles.push(Role._toCppData(role));
        }
      });
    }
    return {
      username: data.username,
      display_name: data.displayName,
      groups: data.groups ? data.groups : [],
      roles: roles,
      password: data.password,
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
  effectiveRoles: Array<AnyRole & { origins: Origin[] }>;

  /**
   * The last time the users password was changed.
   */
  passwordChanged?: Date;

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
  get effectiveRolesAndOrigins(): Array<AnyRole & { origins: Origin[] }> {
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
  static override _fromCppData(data: CppManagementRbacUserAndMetadata): UserAndMetadata {
    const user = User._fromCppData({
      username: data.username,
      display_name: data.display_name,
      groups: data.groups,
      roles: data.roles,
      password: data.password,
    });
    const effectiveRoles = data.effective_roles.map((erole) =>
      RoleAndOrigin._fromCppData(erole as any)
    );
    return new UserAndMetadata({
      ...user,
      domain: authDomainFromCpp(data.domain),
      effectiveRoles: effectiveRoles,
      effectiveRolesAndOrigins: effectiveRoles,
      passwordChanged: data.password_changed
        ? new Date(data.password_changed)
        : undefined,
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
  roles?: (Role<SdkScopedRole> | string)[];

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
  roles: Role<SdkScopedRole>[];

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
  static _fromCppData(data: CppManagementRbacGroup): Group {
    return new Group({
      name: data.name,
      description: data.description ?? '',
      roles: data.roles.map((role) => Role._fromCppData(role as SdkScopedRole)),
      ldapGroupReference: data.ldap_group_reference,
    });
  }

  /**
   * @internal
   */
  static _toCppData(data: IGroup): CppManagementRbacGroup {
    const roles: CppManagementRbacRole[] = [];
    if (data.roles) {
      data.roles.forEach((role) => {
        if (typeof role === 'string') {
          roles.push({
            name: role,
          });
        } else {
          roles.push(Role._toCppData(role));
        }
      });
    }
    return {
      name: data.name,
      description: data.description,
      roles: roles,
      ldap_group_reference: data.ldapGroupReference,
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
export class UserManager<T extends CouchbaseClusterTypes = CouchbaseClusterTypes> {
  private _cluster: Cluster<T>;

  /**
   * @internal
   */
  constructor(cluster: Cluster<T>) {
    this._cluster = cluster;
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

    const cppDomain = authDomainToCpp(options.domainName ?? 'local');
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementUserGet(
        {
          username: username,
          domain: cppDomain,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          wrapCallback(null, UserAndMetadata._fromCppData(resp.user));
        }
      );
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

    const cppDomain = authDomainToCpp(options.domainName ?? 'local');
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementUserGetAll(
        {
          domain: cppDomain,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const users = resp.users.map((user) => UserAndMetadata._fromCppData(user));
          wrapCallback(null, users);
        }
      );
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

    const cppDomain = authDomainToCpp(options.domainName ?? 'local');
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementUserUpsert(
        {
          user: User._toCppData(user),
          domain: cppDomain,
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }
          wrapCallback(err);
        }
      );
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

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementChangePassword(
        {
          newPassword: newPassword,
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }
          wrapCallback(err);
        }
      );
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

    const cppDomain = authDomainToCpp(options.domainName ?? 'local');
    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementUserDrop(
        {
          username: username,
          domain: cppDomain,
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }
          wrapCallback(err);
        }
      );
    }, callback);
  }

  /**
   * Returns a list of roles available on the server.
   *
   * @param options Optional parameters for this operation.
   * @param callback A node-style callback to be invoked after execution.
   */
  async getRoles(
    callback?: NodeCallback<Role<SdkScopedRole>[]>
  ): Promise<Role<SdkScopedRole>[]>;
  async getRoles(
    options: GetRolesOptions,
    callback?: NodeCallback<Role<SdkScopedRole>[]>
  ): Promise<Role<SdkScopedRole>[]>;
  async getRoles(
    options?: GetRolesOptions | NodeCallback<Role<SdkScopedRole>[]>,
    callback?: NodeCallback<Role<SdkScopedRole>[]>
  ): Promise<Role<SdkScopedRole>[]> {
    if (options instanceof Function) {
      callback = options;
      options = undefined;
    }
    if (!options) {
      options = {};
    }

    const timeout = options.timeout ?? this._cluster.managementTimeout;

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementRoleGetAll(
        {
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const roles = resp.roles.map((role) =>
            Role._fromCppData(role as SdkScopedRole)
          );
          wrapCallback(null, roles);
        }
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

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementGroupGet(
        {
          name: groupName,
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          wrapCallback(null, Group._fromCppData(resp.group));
        }
      );
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

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementGroupGetAll(
        {
          timeout: timeout,
        },
        (cppErr, resp) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err, null);
          }
          const groups = resp.groups.map((group) => Group._fromCppData(group));
          wrapCallback(null, groups);
        }
      );
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

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementGroupUpsert(
        {
          group: Group._toCppData(group),
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }
          wrapCallback(err);
        }
      );
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

    return PromiseHelper.wrap((wrapCallback) => {
      this._cluster.conn.managementGroupDrop(
        {
          name: groupName,
          timeout: timeout,
        },
        (cppErr) => {
          const err = errorFromCpp(cppErr);
          if (err) {
            return wrapCallback(err);
          }
          wrapCallback(err);
        }
      );
    }, callback);
  }
}
