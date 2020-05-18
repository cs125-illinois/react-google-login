const path = require("path")

module.exports = {
  pathPrefix: "/react-google-login",
  plugins: [
    {
      resolve: "gatsby-plugin-typescript",
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    "gatsby-transformer-mdx",
    {
      resolve: "gatsby-alias-imports",
      options: {
        aliases: {
          react: "./node_modules/react",
          "@cs125/react-google-login": "..",
        },
      },
    },
    "gatsby-plugin-preload-fonts",
  ],
}
