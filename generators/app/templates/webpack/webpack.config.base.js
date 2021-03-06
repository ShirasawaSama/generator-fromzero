const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('lodash.merge')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const { name } = require('../package.json')
const babelrcFile = path.join(__dirname, '../.babelrc')
let babelrc = {}
if (fs.existsSync(babelrcFile)) {
  babelrc = fs.readFileSync(babelrcFile).toString()
  if (babelrc) babelrc = JSON.parse(babelrc)
}

const targets = {
  android: 30,
  chrome: 35,
  edge: 14,
  explorer: 9,
  firefox: 52,
  safari: 8
}

module.exports = ({ mode, hash, plugins, sourceMap, other }) => {
  process.env.NODE_ENV = mode
  const dev = mode === 'development'
  const babelLoader = {
    loader: 'babel-loader',
    options: merge({
      cacheDirectory: true,
      presets: dev ? [] : [['env', { targets, modules: false, useBuiltIns: !dev }]],
      plugins: [
        'syntax-do-expressions',
        'transform-decorators-legacy',
        'transform-class-properties',
        ['transform-object-rest-spread', { useBuiltIns: true }]
      ]
    }, babelrc, { babelrc: false })
  }
  return Object.assign({
    mode,
    context: path.join(__dirname, '../src'),
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.tsx', '.ts'],
      modules: [
        path.join(__dirname, '../src'),
        'node_modules'
      ]
    },
    entry: {
      index: dev ? './index' : [path.join(__dirname, 'polyfill.js'), './index']
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: hash ? '[name].[chunkhash:8].js' : '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: babelLoader
        },
        {
          test: /\.(le|c)ss$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                sourceMap: !!sourceMap,
                localIdentName: '[local]_[hash:base64:7]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9'
                  ]
                })]
              }
            },
            {
              loader: 'less-loader'
            }
          ]
        },
        {
          test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream'
            }
          }
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: 'file-loader'
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml'
            }
          }
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
          use: 'url-loader'
        }
      ]
    },
    plugins: [
      ...plugins,
      new FriendlyErrorsWebpackPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.HashedModuleIdsPlugin(),
      new HtmlWebpackPlugin({
        title: name,
        template: path.join(__dirname, 'index.ejs'),
        inject: true
      })
    ]
  }, other)
}
