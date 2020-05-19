const path = require("path")

module.exports = {
  pathPrefix: "/react-google-login",
  plugins: [
    "@cs125/gatsby-theme-cs125-docs",
    {
      resolve: "gatsby-alias-imports",
      options: {
        aliases: {
          react: "./node_modules/react",
          "@components": "src/components",
          "@cs125/react-google-login": "..",
        },
      },
    },
  ],
}
