# webpack-fs-dev-server

webpack-dev-server is very heavy because it loads all files into memory.

A solution to the following:

- Read contents from disk (not from memory)
- Use webpack watch

## Installation

```
$ npm install webpack-fs-dev-server
```

## Usage

```
"scripts": {
  "watch": "webpack-fs-dev-server --watch --mode development"
}
```

## Options in webpack.config.js

```
const path = require('path');

module.exports = {
  devServer: {
    host: 'localhost',
    port: 8888
    contentBase: path.resolve(__dirname, 'dist')
  }
};
```
