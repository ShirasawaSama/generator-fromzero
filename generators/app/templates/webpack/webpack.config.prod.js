const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { join } = require('path')

const extend = require('./webpack.config.base')

module.exports = extend({
  hash: true,
  mode: 'production',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new OptimizeCssAssetsPlugin(),
    new ExtractTextPlugin('[name].[chunkhash:8].css'),
    new CleanWebpackPlugin(['dist'], { dir: true, root: join(__dirname, '..') }),
    new CopyWebpackPlugin([ { from: '../public' } ])
  ]
})
