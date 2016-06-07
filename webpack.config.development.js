/* eslint max-len: 0 */
import webpack from 'webpack'
import baseConfig from './webpack.config.base'
import postcssImport from 'postcss-import'
import postcssCssnext from 'postcss-cssnext'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const config = {
  ...baseConfig,

  debug: true,

  // https://webpack.github.io/docs/configuration.html#debug
  // eval is the fatest
  devtool: 'eval',

  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3000/',
    './app/index'
  ],

  output: {
    ...baseConfig.output,
    publicPath: 'http://localhost:3000/dist/'
  },

  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader',
          'css-loader?modules&importLoaders=1!postcss-loader'
        )
      }
    ]
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development')
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
