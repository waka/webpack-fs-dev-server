'use strict';

const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const plugins = [];
if (NODE_ENV !== 'production') {
  plugins.push(
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(__dirname, 'cache/hard-source/js/[confighash]'),
      cachePrune: {
        // cache must be at least 2weeks old.
        maxAge: 14 * 24 * 60 * 60 * 1000,
        // cache must be at least 100MB big in bytes.
        sizeThreshold: 100 * 1024 * 1024
      }
    })
  );
}

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src', 'index.js')
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules')
    ]
  },

  plugins,

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },

  devServer: {
    host: 'localhost',
    port: 8888,
    contentBase: path.resolve(__dirname, 'dist')
  }
};
