import { getRoles } from '@cbjsdev/http-client';
import { getApiConfig, hasOwn } from '@cbjsdev/shared';

const apiConfig = getApiConfig();

const roles = await getRoles(apiConfig);

const typeEntries = roles.map((def) => {
  const roleScope: string[] = [];

  if (hasOwn(def, 'bucket_name')) roleScope.push('bucket_name');
  if (hasOwn(def, 'scope_name')) roleScope.push('scope_name');
  if (hasOwn(def, 'collection_name')) roleScope.push('collection_name');

  return [def.role, roleScope];
});

const type = Object.fromEntries(typeEntries);
console.log(JSON.stringify(type, undefined, 2));
