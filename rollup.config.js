"use strict";

import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import clear from 'rollup-plugin-clear';
import screeps from 'rollup-plugin-screeps';
import obfuscator from 'rollup-plugin-obfuscator';

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
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true
  },

  plugins: [
    clear({ targets: ["dist"] }),
    resolve({ rootDir: "src" }),

    commonjs(),
    typescript(),

    terser(),
    // obfuscator({
    //   global: false,
    //   options: {
    //     compact: true,
    //     controlFlowFlattening: true,
    //     controlFlowFlatteningThreshold: 1,
    //     deadCodeInjection: true,
    //     deadCodeInjectionThreshold: 1,
    //     // debugProtection: true,
    //     // debugProtectionInterval: 4000,
    //     disableConsoleOutput: false,
    //     identifierNamesGenerator: 'hexadecimal',
    //     log: false,
    //     numbersToExpressions: true,
    //     renameGlobals: false,
    //     selfDefending: false,
    //     simplify: true,
    //     splitStrings: true,
    //     splitStringsChunkLength: 5,
    //     stringArray: true,
    //     stringArrayCallsTransform: true,
    //     stringArrayCallsTransformThreshold: 0.5,
    //     stringArrayEncoding: ['rc4'],
    //     stringArrayIndexShift: true,
    //     stringArrayRotate: true,
    //     stringArrayShuffle: true,
    //     stringArrayWrappersCount: 5,
    //     stringArrayWrappersChainedCalls: true,
    //     stringArrayWrappersParametersMaxCount: 5,
    //     stringArrayWrappersType: 'function',
    //     stringArrayThreshold: 1,
    //     transformObjectKeys: true,
    //     unicodeEscapeSequence: false
    //   }
    // }),
    screeps({ config: cfg })
  ]
}
