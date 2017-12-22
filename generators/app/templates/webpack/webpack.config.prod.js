const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = require('./webpack.config.base.js')({
  hash: true,
  env: 'production',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new OptimizeCssAssetsPlugin(),
    new ExtractTextPlugin('[name].[chunkhash:8].css'),
    new CleanWebpackPlugin(['../dist']),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true,
        ascii_only: true
      }
    })
  ]
})
