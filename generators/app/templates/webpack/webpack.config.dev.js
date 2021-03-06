const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const { join } = require('path')

const extend = require('./webpack.config.base')

module.exports = extend({
  sourceMap: true,
  mode: 'development',
  other: {
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      hot: true,
      publicPath: '/',
      historyApiFallback: true,
      clientLogLevel: 'warning',
      port: process.env.PORT || 8777,
      contentBase: join(__dirname, '../public')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin()
  ]
})
