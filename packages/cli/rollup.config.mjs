import fs from 'fs';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
  input: 'src/index.ts',
  plugins: [
    del({ targets: ['dist/*'] }),
    typescript({
      tsconfigOverride: {
        include: ['src', 'types.d.ts'],
      },
    }),
    getBabelOutputPlugin({
      plugins: [['@babel/plugin-transform-runtime']],
    }),
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
