import typescript from "rollup-plugin-typescript2"

export default ["cjs", "es"].map(format => ({
  input: "./src/index.tsx",
  output: {
    format,
    file: `./dist/index.${format}.js`,
    sourcemap: true,
    strict: false,
  },
  plugins: [
    typescript({
      tsconfigDefaults: {
        include: ["./src/**/*"],
        compilerOptions: { declaration: true },
      },
    }),
  ],
  external: ["react", "prop-types"],
}))
