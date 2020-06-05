export const pathPrefix = "/react-google-login"

export const plugins = [
  "@cs125/gatsby-theme-cs125",
  "gatsby-plugin-typescript",
  {
    resolve: "gatsby-alias-imports",
    options: {
      aliases: {
        react: "./node_modules/react",
        "@cs125/react-google-login": "..",
      },
    },
  },
]
