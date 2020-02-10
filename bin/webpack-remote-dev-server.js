#!/usr/bin/env node

'use strict';

/* eslint-disable no-shadow, no-console */

// node_modules
const webpack = require('webpack');
const yargs = require('yargs');
const cli = require('./cli');

// lib
const Server = require('../lib/server');
const { info, error } = require('../lib/utils/color');
const { createLogger } = require('../lib/utils/logger');
const { setupExitSignals } = require('../lib/utils/signals');

const serverData = { server: null };

function startDevServer(config, options) {
  let compiler, server;
  const logger = createLogger(options);

  try {
    compiler = webpack(config);
  } catch (err) {
    if (err instanceof webpack.WebpackOptionsValidationError) {
      logger.error(error(options.stats.colors, err.message));
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
    throw err;
  }

  try {
    server = new Server(compiler, options, logger);
    serverData.server = server;
  } catch (err) {
    if (err.name === 'ValidationError') {
      logger.error(error(options.stats.colors, err.message));
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
    throw err;
  }

  server.listen(options.port, options.host, (app, err) => {
    if (err) {
      throw err;
    }
  });

  compiler.watch(
    config.watchOptions || { aggregateTimeout: 300, poll: undefined },
    (err, stats) => {
      if (err) {
        logger.error(error(true, err.message));
      }
      logger.info(stats.toString({ chunks: false, colors: true }));
    }
  );
}

// Process arguments
const argv = cli.processArgs(yargs);
const config = cli.processConfig(argv);
const options = cli.processOptions(argv, config);

// Run express server with webpack
setupExitSignals(serverData);
startDevServer(config, options);
