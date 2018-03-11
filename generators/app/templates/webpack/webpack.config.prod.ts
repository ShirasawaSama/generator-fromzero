import * as webpack from 'webpack'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { join } from 'path'

import extend from './webpack.config.base'

export default extend({
  hash: true,
  mode: 'production',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(false),
    new OptimizeCssAssetsPlugin(),
    new ExtractTextPlugin('[name].[chunkhash:8].css'),
    new CleanWebpackPlugin(['dist'], { dir: true, root: join(__dirname, '..') }),
    new (CopyWebpackPlugin as any)([ { from: '../public' } ])
  ]
})
