exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        'react': __dirname + '/node_modules/react',
      }
    },
  })
}
