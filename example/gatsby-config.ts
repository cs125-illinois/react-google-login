export const pathPrefix = "/react-google-login"

import { String } from "runtypes"
const title = String.check(process.env.npm_package_name)
const description = String.check(process.env.npm_package_description)

export const siteMetadata = { title, description }
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
