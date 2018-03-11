import * as webpack from 'webpack'
import * as CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import { join } from 'path'

import extend from './webpack.config.base'

export default extend({
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
