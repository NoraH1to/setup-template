import pluginTerser from '@rollup/plugin-terser';
import pluginTypescript from '@rollup/plugin-typescript';
import pluginEslint from '@rollup/plugin-eslint';
import pluginDelete from 'rollup-plugin-delete';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginResolve from '@rollup/plugin-node-resolve';

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'hook/index.js',
      format: 'esm',
    },
  ],
  plugins: [
    pluginDelete({
      targets: ['hook/*'],
    }),
    pluginEslint(),
    pluginResolve(),
    pluginCommonjs(),
    pluginTypescript(),
    pluginTerser(),
  ],
};

export default config;
