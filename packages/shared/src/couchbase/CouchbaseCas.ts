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
import { hasOwn } from '../misc/index.js';

/**
 * CAS represents an opaque value which can be used to compare documents to
 * determine if a change has occurred.
 *
 * @category Key-Value
 */
export type Cas = {
  /**
   * Generates a string representation of this CAS.
   */
  toString(): string;

  /**
   * Generates a JSON representation of this CAS.
   */
  toJSON(): string;
};

export type CasInput = Cas | string | Buffer;

export type CouchbaseCasInput = Cas | Buffer | string | bigint | number;

/**
 * Create, parse and compare CAS objects.
 */
export class CouchbaseCas implements Cas {
  private readonly input: CouchbaseCasInput;
  private get raw() {
    return CouchbaseCas.toBuffer(this.input);
  }

  constructor(value: CouchbaseCasInput) {
    this.input = value;
  }

  /**
   * Returns `true` is the given value is of type {@link CouchbaseCasInput}.
   *
   * CouchbaseCasInput is a union type that accept more representations of a Cas. It was used
   * before the official library introduced {@link CasInput}, which should be your preferred type now.
   *
   * @param value
   */
  public static isCouchbaseCasInput(value: unknown): value is CouchbaseCasInput {
    return (
      value instanceof Buffer ||
      CouchbaseCas.isCasObject(value) ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'bigint'
    );
  }

  /**
   * Returns `true` is the given value is of type {@link CasInput}.
   *
   * @param value
   */
  public static isCasInput(value: unknown): value is CasInput {
    return (
      typeof value === 'string' ||
      Buffer.isBuffer(value) ||
      CouchbaseCas.isCasObject(value)
    );
  }

  /**
   * Returns `true` is the given value extends the {@Cas} interface.
   *
   * @param value
   */
  public static isCasObject(value: unknown): value is Cas {
    return (
      typeof value === 'object' &&
      value !== null &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typeof value.toJSON === 'function' &&
      typeof value.toString === 'function' &&
      hasOwn(value, 'raw') &&
      value.raw instanceof Uint8Array
    );
  }

  private static toBuffer(value: CouchbaseCasInput): Buffer {
    if (Buffer.isBuffer(value)) return value;

    const valuePrimitive = CouchbaseCas.isCasObject(value) ? value.toString() : value;

    let binaryString = BigInt(valuePrimitive).toString(2);

    // Byte padding
    const padding = 8 - (binaryString.length % 8);
    binaryString = '0'.repeat(padding) + binaryString;

    const bytes = [];
    for (let i = 0; i < binaryString.length; i += 8) {
      bytes.push(parseInt(binaryString.substring(i, i + 8), 2));
    }

    return Buffer.from(bytes.reverse());
  }

  public static from(value: CouchbaseCasInput) {
    return new CouchbaseCas(value);
  }

  toJSON(): string {
    return this.toString();
  }

  toString(): string {
    if (!Buffer.isBuffer(this.input)) {
      return this.input.toString();
    }

    const binaryString = Array.from(this.input)
      .reverse()
      .map((byte) => byte.toString(2).padStart(8, '0'))
      .join('');

    return BigInt('0b' + binaryString).toString(10);
  }

  isEqual(cas: CouchbaseCasInput) {
    return CouchbaseCas.isEqual(this, cas);
  }

  isZeroCas(): boolean {
    return CouchbaseCas.isZeroCas(this);
  }

  public static toString(cas: CouchbaseCasInput): string {
    return CouchbaseCas.from(cas).toString();
  }

  public static isZeroCas(cas: CouchbaseCasInput): boolean {
    return CouchbaseCas.isEqual('0', CouchbaseCas.toString(cas));
  }

  public static isEqual(cas1: CouchbaseCasInput, cas2: CouchbaseCasInput): boolean {
    return cas1.toString() === cas2.toString();
  }

  /**
   * When fetching a CAS from inside a document that has been set with {@link MutateInMacro.CAS}, it is stored in a form
   * that is not the one expected by the SDK.
   * Use this function to normalize the representation so you can use it elsewhere.
   *
   * @param cas
   */
  public static normalizeCas(cas: string): string {
    const buf = Buffer.from(cas.startsWith('0x') ? cas.slice(2) : cas, 'hex');
    return BigInt(`0x${buf.reverse().toString('hex')}`).toString();
  }
}
