import typescript from "rollup-plugin-typescript2"

export default {
  input: "./src/index.tsx",
  output: {
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    format: "umd",
    name: "google-login",
    file: "./dist/google-login.umd.js"
  },
  plugins: [typescript()],
  external: ['react', 'react-dom']
}
