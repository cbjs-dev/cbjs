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
import { StringHex } from './utils/index.js';

export type MutateInMacroShape<
  Value extends keyof MutateInMacroReturnType = keyof MutateInMacroReturnType,
> = {
  _value: Value;
};

/**
 * An object type with the macro string as key and the return type as parameter.
 */
export type MutateInMacroReturnType = {
  '${Mutation.CAS}': StringHex;
  '${Mutation.seqno}': StringHex;
  '${Mutation.value_crc32c}': StringHex;
};
