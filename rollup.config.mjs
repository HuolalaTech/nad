import fs from 'fs';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
  input: 'src/index.ts',
  plugins: [
    typescript({
      tsconfigOverride: {
        include: ['src', 'types.d.ts'],
      },
    }),
    del({ targets: ['dist/*'] }),
    json(),
    getBabelOutputPlugin({
      plugins: [['@babel/plugin-transform-runtime']],
    }),
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
  ],
  external: Object.keys(pkg.dependencies),
  output: {
    file: pkg.main,
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
    inlineDynamicImports: true,
  },
};
