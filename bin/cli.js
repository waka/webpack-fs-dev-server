'use strict';

const fs = require('fs');
const path = require('path');
const program = require('commander');

const cwd = process.cwd();

const isAbsoluteUrl = (url) => {
  if (typeof url !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof url}\``);
  }
  // Don't match Windows paths `c:\`
  if (/^[a-zA-Z]:\\/.test(url)) {
    return false;
  }
  // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
  // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
};

const processArgs = () => {
  program.version('v1.0.0');
  program.option(
    '-c, --config <path>',
    'path to webpack.config.js, default to ./webpack.config.js',
    'webpack.config.js'
  );
  program.option(
    '-m, --mode <development or production>',
    'running mode for webpack, default to development',
    'development'
  );
  program.parse(process.argv);

  return program;
};

const processConfigAndOptions = (argv) => {
  const configPath = path.join(cwd, argv.config);
  if (!fs.existsSync(configPath)) {
    throw new Error('webpack config file path is required');
  }
  const config = require(configPath);

  const firstWpOpt = Array.isArray(config) ? config[0] : config;
  const options = firstWpOpt.devServer || {};

  // This updates both config and firstWpOpt
  firstWpOpt.mode = argv.mode || firstWpOpt.mode || 'development';

  if (!options.host) {
    options.host = 'localhost';
  }
  if (!options.port) {
    options.port = 8888;
  }
  if (!options.contentBase) {
    options.contentBase = '/';
  }
  if (!options.publicPath) {
    options.publicPath = (firstWpOpt.output && firstWpOpt.output.publicPath) || '';

    if (
      !isAbsoluteUrl(String(options.publicPath)) &&
      options.publicPath[0] !== '/'
    ) {
      options.publicPath = `/${options.publicPath}`;
    }
  }

  return { config, options };
};

module.exports = { processArgs, processConfigAndOptions };
