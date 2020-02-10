'use strict';

const options = require('./options');

const getVersions = () => {
  return `webpack-remote-dev-server ${require('../package.json').version}`;
};

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

const processArgs = (yargs) => {
  // webpack-cli@3.3 path : 'webpack-cli/bin/config/config-yargs'
  let configYargsPath;
  try {
    require.resolve('webpack-cli/bin/config/config-yargs');
    configYargsPath = 'webpack-cli/bin/config/config-yargs';
  } catch (e) {
    configYargsPath = 'webpack-cli/bin/config-yargs';
  }
  // eslint-disable-next-line import/no-extraneous-dependencies
  // eslint-disable-next-line import/no-dynamic-require
  require(configYargsPath)(yargs);

  // It is important that this is done after the webpack yargs config,
  // so it overrides webpack's version info.
  yargs.version(getVersions());
  yargs.options(options);

  return yargs.argv;
};

const processConfig = (yargs, argv) => {
  // webpack-cli@3.3 path : 'webpack-cli/bin/utils/convert-argv'
  let convertArgvPath;
  try {
    require.resolve('webpack-cli/bin/utils/convert-argv');
    convertArgvPath = 'webpack-cli/bin/utils/convert-argv';
  } catch (e) {
    convertArgvPath = 'webpack-cli/bin/convert-argv';
  }
  // eslint-disable-next-line import/no-extraneous-dependencies
  // eslint-disable-next-line import/no-dynamic-require
  const config = require(convertArgvPath)(yargs, argv, {
    outputFilename: '/bundle.js',
  });

  return config;
};

const processOptions = (argv, config) => {
  const firstWpOpt = Array.isArray(config) ? config[0] : config;
  const options = firstWpOpt.devServer || {};

  // This updates both config and firstWpOpt
  firstWpOpt.mode = firstWpOpt.mode || 'development';

  if (argv.host && (argv.host !== 'localhost' || !options.host)) {
    options.host = argv.host;
  }

  if (argv.public) {
    options.public = argv.public;
  }

  if (argv.profile) {
    options.profile = argv.profile;
  }

  if (argv.progress) {
    options.progress = argv.progress;
  }

  if (!options.publicPath) {
    // eslint-disable-next-line
    options.publicPath =
      (firstWpOpt.output && firstWpOpt.output.publicPath) || '';

    if (
      !isAbsoluteUrl(String(options.publicPath)) &&
      options.publicPath[0] !== '/'
    ) {
      options.publicPath = `/${options.publicPath}`;
    }
  }

  if (!options.filename && firstWpOpt.output && firstWpOpt.output.filename) {
    options.filename = firstWpOpt.output && firstWpOpt.output.filename;
  }

  if (!options.watchOptions && firstWpOpt.watchOptions) {
    options.watchOptions = firstWpOpt.watchOptions;
  }

  if (argv.stdin) {
    process.stdin.on('end', () => {
      // eslint-disable-next-line no-process-exit
      process.exit(0);
    });

    process.stdin.resume();
  }

  // TODO https://github.com/webpack/webpack-dev-server/issues/616 (v4)
  // We should prefer CLI arg under config, now we always prefer `hot` from `devServer`
  if (!options.hot) {
    options.hot = argv.hot;
  }

  // TODO https://github.com/webpack/webpack-dev-server/issues/616 (v4)
  // We should prefer CLI arg under config, now we always prefer `hotOnly` from `devServer`
  if (!options.hotOnly) {
    options.hotOnly = argv.hotOnly;
  }

  // TODO https://github.com/webpack/webpack-dev-server/issues/616 (v4)
  // We should prefer CLI arg under config, now we always prefer `clientLogLevel` from `devServer`
  if (!options.clientLogLevel && argv.clientLogLevel) {
    options.clientLogLevel = argv.clientLogLevel;
  }

  if (argv.contentBase) {
    options.contentBase = argv.contentBase;

    if (Array.isArray(options.contentBase)) {
      options.contentBase = options.contentBase.map((p) => path.resolve(p));
    } else if (/^[0-9]$/.test(options.contentBase)) {
      options.contentBase = +options.contentBase;
    } else if (!isAbsoluteUrl(String(options.contentBase))) {
      options.contentBase = path.resolve(options.contentBase);
    }
  }
  // It is possible to disable the contentBase by using
  // `--no-content-base`, which results in arg["content-base"] = false
  else if (argv.contentBase === false) {
    options.contentBase = false;
  }

  if (argv.watchContentBase) {
    options.watchContentBase = true;
  }

  if (!options.stats) {
    options.stats = firstWpOpt.stats || { cached: false, cachedAssets: false };
  }

  if (
    typeof options.stats === 'object' &&
    typeof options.stats.colors === 'undefined' &&
    argv.color
  ) {
    options.stats = Object.assign({}, options.stats, { colors: argv.color });
  }

  if (argv.lazy) {
    options.lazy = true;
  }

  if (argv.key) {
    options.key = argv.key;
  }

  if (argv.inline === false) {
    options.inline = false;
  }

  if (argv.compress) {
    options.compress = true;
  }

  if (argv.useLocalIp) {
    options.useLocalIp = true;
  }

  // Kind of weird, but ensures prior behavior isn't broken in cases
  // that wouldn't throw errors. E.g. both argv.port and options.port
  // were specified, but since argv.port is 8080, options.port will be
  // tried first instead.
  options.port =
    argv.port === '3000'
      ? (options.port || argv.port)
      : (argv.port || options.port);

  return options;
};

module.exports = { processArgs, processConfig, processOptions };
