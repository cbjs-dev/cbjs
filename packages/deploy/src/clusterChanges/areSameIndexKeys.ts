import { quotePath } from '@cbjsdev/shared';

// `ASC` is absent on purpose : it is the default, the server never reports it.
const indexKeyModifiers = ['INCLUDE MISSING', 'DESC', 'VECTOR'] as const;

const trailingModifier = /\s+(INCLUDE\s+MISSING|VECTOR|ASC|DESC)$/i;

export function areSameIndexKeys(keys1: string[], keys2: string[]) {
  const keyStrings1 = keys1.map(normalizeIndexKey).join(', ');
  const keyStrings2 = keys2.map(normalizeIndexKey).join(', ');

  return keyStrings1 === keyStrings2;
}

/**
 * `vector VECTOR` and `` `vector` VECTOR `` are the same key.
 */
function normalizeIndexKey(key: string) {
  const { expression, modifiers } = splitModifiers(key);
  const normalizedModifiers = indexKeyModifiers.filter((m) => modifiers.includes(m));

  return [quotePath(stripParentheses(expression)), ...normalizedModifiers].join(' ');
}

function splitModifiers(key: string) {
  const modifiers: string[] = [];
  let expression = key.trim();

  for (let match = trailingModifier.exec(expression); match; ) {
    modifiers.push(match[1].toUpperCase().replace(/\s+/, ' '));
    expression = expression.slice(0, match.index).trim();
    match = trailingModifier.exec(expression);
  }

  return { expression, modifiers };
}

function stripParentheses(str: string) {
  if (str.startsWith('(`') && str.endsWith('`)')) {
    return str.substring(1, str.length - 1);
  }

  return str;
}
