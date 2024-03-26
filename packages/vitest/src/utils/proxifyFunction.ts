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
import { AnyFunction, KeysByValue, Try } from '@cbjsdev/shared';

/**
 * Returns a function that properly handles the value of `this` within a proxy handler,
 * typically when you want to fallback to the function default's behaviour.
 * This function allow the access to native private properties.
 *
 * @example
 * return proxifyFunction(target, receiver, prop);
 * @param target
 * @param prop
 * @param receiver
 * @param transformArgs
 */
export function proxifyFunction<
  T,
  K extends KeysByValue<T, AnyFunction>,
  Fn extends Try<T[K], AnyFunction> = Try<T[K], AnyFunction>,
>(
  target: T,
  prop: K,
  receiver: T,
  transformArgs?: (...args: Parameters<Fn>) => Readonly<Parameters<Fn>>
) {
  return function (this: T, ...args: Parameters<Fn>) {
    const fn = target[prop] as Fn;
    const transformedArgs = transformArgs ? transformArgs(...args) : args;
    return fn.apply(this === receiver ? target : this, transformedArgs);
  };
}
