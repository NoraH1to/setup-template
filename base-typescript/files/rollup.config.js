import pluginTerser from '@rollup/plugin-terser';
import pluginTypescript from '@rollup/plugin-typescript';
import pluginEslint from '@rollup/plugin-eslint';
import pluginDelete from 'rollup-plugin-delete';

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'es/index.js',
      format: 'esm',
    },
    {
      file: 'lib/index.cjs',
      format: 'cjs',
    },
  ],
  plugins: [
    pluginDelete({
      targets: ['es/*', 'lib/*'],
    }),
    pluginEslint(),
    pluginTypescript(),
    pluginTerser(),
  ],
};

export default config;
