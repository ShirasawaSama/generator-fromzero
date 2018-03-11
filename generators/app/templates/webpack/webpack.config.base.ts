import * as fs from 'fs'
import * as path from 'path'
import * as webpack from 'webpack'
import * as merge from 'lodash.merge'
import * as autoprefixer from 'autoprefixer'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'

const { name } = require('../package.json')
const babelrcFile = path.join(__dirname, '../.babelrc')
let babelrc = {}
if (fs.existsSync(babelrcFile)) {
  babelrc = fs.readFileSync(babelrcFile).toString()
  if (babelrc) babelrc = JSON.parse(babelrc as string)
}

const targets = {
  android: 30,
  chrome: 35,
  edge: 14,
  explorer: 9,
  firefox: 52,
  safari: 8
}

export default (args: { mode: string, hash?: boolean, plugins?: any[], sourceMap?: boolean, other?: any }) => {
  const { mode, hash, plugins, sourceMap, other } = args
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
      extensions: ['.wasm, .mjs', '.js', '.json', '.jsx', '.tsx', '.ts'],
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
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader', options: { compilerOptions: { module: 'esnext' } } }, babelLoader]
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
