"use strict";

import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import copy from 'rollup-plugin-copy'
import clear from 'rollup-plugin-clear';
import screeps from 'rollup-plugin-screeps';

const { terser } = require('rollup-plugin-terser')

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified - code will be compiled but not uploaded");
} else if ((cfg = require("./screeps.json")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

export default {
  input: "src/main.ts",
  output: {
    format: "cjs",
    file: "dist/main.js",
    sourcemap: true,
  },

  plugins: [
    clear({ targets: ["dist"] }),
    resolve({ rootDir: "src" }),

    commonjs(),
    typescript(),

    terser(),

    screeps({ config: cfg }),

    copy({
      targets: [
        {
          src: 'dist/main.js',
          dest: 'C:\\Users\\jason\\AppData\\Local\\Screeps\\scripts\\127_0_0_1___21025\\default',
        },
        {
          src: 'dist/main.js.map',
          dest: 'C:\\Users\\jason\\AppData\\Local\\Screeps\\scripts\\127_0_0_1___21025\\default',
          rename: name => name + '.map.js',
          transform: contents => `module.exports = ${contents.toString()};`
        }
      ],
      hook: 'writeBundle',
      verbose: true
    })
  ]
}
