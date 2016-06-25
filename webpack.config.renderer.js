/* eslint max-len: 0 */
import webpack from 'webpack'
import baseConfig from './webpack.config.base'
import postcssImport from 'postcss-import'
import postcssCssnext from 'postcss-cssnext'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const config = {
  ...baseConfig,

  entry: './app/index',

  output: {
    ...baseConfig.output,
    publicPath: './dist/'
  },

  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader',
          'css-loader?modules&importLoaders=1!postcss-loader',
          {
            publicPath: '../dist/'
          }
        )
      }
    ]
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        APP_ID: JSON.stringify(process.env.LEANCLOUD_APP_ID),
        APP_KEY: JSON.stringify(process.env.LEANCLOUD_APP_KEY)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    }),
    new ExtractTextPlugin('style.css', {allChunks: true})
  ],

  postcss() {
    return [
      postcssImport({path: `${__dirname}/app`}),
      postcssCssnext(),
    ]
  },

  target: 'electron-renderer'
}

export default config
