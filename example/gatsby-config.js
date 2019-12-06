module.exports = {
  plugins: [
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `src/images/icon.png`
      }
    }
  ]
}
