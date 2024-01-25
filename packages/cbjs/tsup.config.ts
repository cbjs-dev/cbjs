import { defineConfig } from 'tsup';

export default defineConfig(() => ({
  entry: { cbjs: 'src/index.ts' },
  splitting: false,
  minify: false,
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  platform: 'node',
}));
