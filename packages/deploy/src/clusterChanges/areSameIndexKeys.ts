import { quotePath } from '@cbjsdev/shared';

export function areSameIndexKeys(keys1: string[], keys2: string[]) {
  function stripParentheses(str: string) {
    if (str.startsWith('(`') && str.endsWith('`)')) {
      return str.substring(1, str.length - 1);
    }

    return str;
  }
  const keyStrings1 = keys1.map(stripParentheses).map(quotePath).join(', ');
  const keyStrings2 = keys2.map(stripParentheses).map(quotePath).join(', ');

  return keyStrings1 === keyStrings2;
}
