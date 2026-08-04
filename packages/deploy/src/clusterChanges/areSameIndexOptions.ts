import { QueryIndexWithClause } from '@cbjsdev/shared';

/**
 * Compare the `WITH` options requested for an index with the options of the existing index.
 *
 * Only the requested options are compared : the cluster reports its own defaults
 * (`num_partition`, `retain_deleted_xattr`, `scan_nprobes`, ...) and normalizes some
 * values - `similarity` is lowercased - which would otherwise be seen as a change on
 * every deployment.
 *
 * `num_replica` is left out : the number of replicas is altered, not recreated.
 */
export function areSameIndexOptions(
  requestedOptions: QueryIndexWithClause | undefined,
  currentOptions: QueryIndexWithClause | undefined
) {
  if (requestedOptions === undefined) return true;

  const current = currentOptions ?? {};

  return Object.entries(requestedOptions)
    .filter(([option]) => option !== 'num_replica')
    .every(([option, value]) => areSameOptionValues(value, current[option]));
}

function areSameOptionValues(requestedValue: unknown, currentValue: unknown): boolean {
  if (typeof requestedValue === 'string' && typeof currentValue === 'string') {
    return requestedValue.toLowerCase() === currentValue.toLowerCase();
  }

  if (Array.isArray(requestedValue) && Array.isArray(currentValue)) {
    return (
      requestedValue.length === currentValue.length &&
      requestedValue.every((value, index) =>
        areSameOptionValues(value, currentValue[index])
      )
    );
  }

  return requestedValue === currentValue;
}
