import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

const basic = {
  input: 'src/index.ts',
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          types: [],
          lib: ['ES5', 'DOM', 'ES2015.Promise'],
        },
        exclude: ['src/tests'],
      },
    }),
    getBabelOutputPlugin({
      plugins: [['@babel/plugin-transform-runtime']],
    }),
  ],
  external: Object.keys(pkg.dependencies),
};

export default [
  { ...basic, output: { file: pkg.main, format: 'cjs', exports: 'named', sourcemap: true } },
  { ...basic, output: { file: pkg.module, format: 'es', exports: 'named', sourcemap: true } },
];
