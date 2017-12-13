const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const { join } = require('path')

const port = process.env.PORT || 8080

module.exports = require('./webpack.config.base.js')({
  sourceMap: true,
  env: 'development',
  other: {
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      port,
      hot: true,
      publicPath: '/',
      historyApiFallback: true,
      contentBase: join(__dirname, '../public')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:' + port })
  ]
})
