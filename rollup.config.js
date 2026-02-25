import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";

let development = process.env.NODE_ENV === 'development';
const enableScripting = process.env.ENABLE_SCRIPTING === "true";

if(!development) {
    development = false;
}

export default [
  {
    input: 'index.ts',
    output: {
      file: 'dist/besaz.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      replace({
        preventAssignment: true,
        __DEBUG_MODE__: development ? true : false,
        __BEHAVIOR_SCRIPTING_ENABLED__: enableScripting ? true : false,
        __VERSION__: JSON.stringify("1.0.0"),
      }),
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ]
  },
  {
    input: './dist/types/index.d.ts',
    output: { file: 'dist/besaz.d.ts', format: 'es' },
    plugins: [dts()]
  }
];