import { dirname, resolve } from 'path';

export const rootDir = resolve(dirname(new URL(import.meta.url).pathname));
