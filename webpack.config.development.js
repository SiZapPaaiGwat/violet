/* eslint max-len: 0 */
import webpack from 'webpack'
import baseConfig from './webpack.config.base'
import postcssImport from 'postcss-import'
import postcssCssnext from 'postcss-cssnext'

const config = {
  ...baseConfig,

  debug: true,

  devtool: 'cheap-module-eval-source-map',

  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3000/',
    // 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
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
        loaders: [
          'style-loader',
          'css-loader?sourceMap&modules!postcss-loader'
        ]
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
    })
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
