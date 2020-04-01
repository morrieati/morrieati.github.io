/* config-overrides.js */
const {
  override,
  addWebpackModuleRule,
  addWebpackAlias
} = require('customize-cra')

module.exports = override(
  addWebpackModuleRule(
    {
      test: /\.js$/,
      use: 'unlazy-loader',
      include: /node_modules\/markdown-toc/,
    },
  ),
  addWebpackAlias({
    querystring: 'querystring-browser'
  })
)
