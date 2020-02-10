import log from 'webpack-log';

const createLogger = (options = {}) => {
  let level = options.level || 'info';
  if (options.quiet) {
    level = 'silent';
  }
  return log({ name: 'wrds', level, timestamp: options.logTime });
};

export { createLogger };


