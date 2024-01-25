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

/**
 * IPasswordAuthenticator specifies an authenticator which uses an RBAC
 * username and password to authenticate with the cluster.
 *
 * @category Authentication
 */
export interface IPasswordAuthenticator {
  /**
   * The username to authenticate with.
   */
  username: string

  /**
   * The password to autehnticate with.
   */
  password: string

  /**
   * The sasl mechanisms to authenticate with.
   */
  allowed_sasl_mechanisms?: string[]
}

/**
 * IPasswordAuthenticator specifies an authenticator which uses an SSL
 * certificate and key to authenticate with the cluster.
 *
 * @category Authentication
 */
export interface ICertificateAuthenticator {
  /**
   * The path to the certificate which should be used for certificate authentication.
   */
  certificatePath: string

  /**
   * The path to the key which should be used for certificate authentication.
   */
  keyPath: string
}

/**
 * PasswordAuthenticator implements a simple IPasswordAuthenticator.
 *
 * @category Authentication
 */
export class PasswordAuthenticator implements IPasswordAuthenticator {
  /**
   * The username that will be used to authenticate with.
   */
  username: string

  /**
   * The password that will be used to authenticate with.
   */
  password: string

  /**
   * The sasl mechanisms to authenticate with.
   */
  allowed_sasl_mechanisms?: string[] | undefined

  /**
   * Constructs this PasswordAuthenticator with the passed username and password.
   *
   * @param username The username to initialize this authenticator with.
   * @param password The password to initialize this authenticator with.
   */
  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  /**
   * Creates a LDAP compatible password authenticator which is INSECURE if not used with TLS.
   *
   * Please note that this is INSECURE and will leak user credentials on the wire to eavesdroppers.
   * This should only be enabled in trusted environments.
   *
   * @param username The username to initialize this authenticator with.
   * @param password The password to initialize this authenticator with.
   */
  public static ldapCompatible(
    username: string,
    password: string
  ): PasswordAuthenticator {
    const auth = new PasswordAuthenticator(username, password)
    auth.allowed_sasl_mechanisms = ['PLAIN']
    return auth
  }
}

/**
 * CertificateAuthenticator implements a simple ICertificateAuthenticator.
 *
 * @category Authentication
 */
export class CertificateAuthenticator implements ICertificateAuthenticator {
  /**
   * The path to the certificate which should be used for certificate authentication.
   */
  certificatePath: string

  /**
   * The path to the key which should be used for certificate authentication.
   */
  keyPath: string

  /**
   * Constructs this CertificateAuthenticator with the passed certificate and key paths.
   *
   * @param certificatePath The certificate path to initialize this authenticator with.
   * @param keyPath The key path to initialize this authenticator with.
   */
  constructor(certificatePath: string, keyPath: string) {
    this.certificatePath = certificatePath
    this.keyPath = keyPath
  }
}

/**
 * Represents any of the valid authenticators that could be passed to the SDK.
 *
 * @category Authentication
 */
export type Authenticator = IPasswordAuthenticator | ICertificateAuthenticator
