'use strict';

const path = require('path');

const entries = {
  index: path.resolve(__dirname, 'src', 'index.js')
};

module.exports = {
  entry: entries,

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
