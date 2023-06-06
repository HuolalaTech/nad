import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
  input: 'src/index.ts',
  plugins: [
    del({ targets: ['dist/*'] }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          types: [],
          lib: ['ES2020', 'DOM'],
        },
        exclude: ['src/tests'],
      },
    }),
    getBabelOutputPlugin({
      plugins: [['@babel/plugin-transform-runtime']],
    }),
  ],
  external: Object.keys(pkg.dependencies),
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named', sourcemap: true },
    { file: pkg.module, format: 'es', exports: 'named', sourcemap: true },
  ],
};
