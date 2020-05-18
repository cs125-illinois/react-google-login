const path = require("path")

module.exports = {
  pathPrefix: "/react-google-login",
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        defaultLayouts: {
          pages: require.resolve("./src/layouts/index.tsx"),
        },
      },
    },
    {
      resolve: "gatsby-plugin-typescript",
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
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
    "gatsby-plugin-preload-fonts",
  ],
}
