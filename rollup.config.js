import fs from 'fs';
import clear from 'rollup-plugin-clear';
import screeps from 'rollup-plugin-screeps';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const dest = process.env.DEST;
if (!dest) throw new Error("INVALID ENV " + dest);

const cfg = JSON.parse(fs.readFileSync('screeps.json'))[dest];
if (!cfg) throw new Error("INVALID CFG");

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

    screeps({ config: cfg }),
  ]
}
