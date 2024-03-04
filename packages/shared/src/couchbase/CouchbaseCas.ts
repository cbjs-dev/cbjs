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

/**
 * Create, parse and compare CAS objects.
 */
export class CouchbaseCas implements Cas {
  private raw: Buffer;

  constructor(value: string | bigint | number) {
    this.raw = CouchbaseCas.toBuffer(value);
  }

  private static toBuffer(value: string | bigint | number): Buffer {
    let binaryString = BigInt(value).toString(2);

    // Byte padding
    const padding = 8 - (binaryString.length % 8);
    binaryString = '0'.repeat(padding) + binaryString;

    const bytes = [];
    for (let i = 0; i < binaryString.length; i += 8) {
      bytes.push(parseInt(binaryString.substring(i, i + 8), 2));
    }

    return Buffer.from(bytes.reverse());
  }

  public static from(value: string | bigint | number) {
    return new CouchbaseCas(value);
  }

  toJSON(): string {
    return this.toString();
  }

  toString(): string {
    const binaryString = Array.from(this.raw)
      .reverse()
      .map((byte) => byte.toString(2).padStart(8, '0'))
      .join('');

    return BigInt('0b' + binaryString).toString(10);
  }

  isEqual(cas: Cas | string | bigint | number) {
    return CouchbaseCas.isEqual(this, cas);
  }

  isZeroCas(): boolean {
    return CouchbaseCas.isZeroCas(this);
  }

  public static isZeroCas(cas: Cas | string | bigint | number): boolean {
    return CouchbaseCas.isEqual('0', cas);
  }

  public static isEqual(
    cas1: Cas | string | bigint | number,
    cas2: Cas | string | bigint | number
  ): boolean {
    return cas1.toString() === cas2.toString();
  }
}
