/**
 * Returns a tuple [options, callback].
 *
 * @param args
 * @example
 * const [options = {}, callback] = resolveOptionsAndCallback(args);
 */
export function resolveOptionsAndCallback<
  Options extends object,
  Callback extends (...args: never[]) => unknown,
>(
  args: [callback?: Callback] | [options: Options, callback?: Callback]
): [Options | undefined, Callback | undefined] {
  if (typeof args[0] === 'function') {
    return [undefined, args[0]];
  }

  return [args[0], args[1]];
}
