import typescript from "rollup-plugin-typescript2"

export default {
  input: "./src/index.tsx",
  output: {
    format: "cjs",
    file: "./dist/index.cjs.js",
  },
  plugins: [typescript()],
  external: ["react", "prop-types"],
}
