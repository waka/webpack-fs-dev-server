import handler from 'serve-handler';
import http from 'http';
import killable from 'killable';
import { info } from './utils/colors';
import { createDomain } from './utils/domain';
import { createLogger } from './utils/logger';

const cwd = process.cwd();

const createServer = (compiler, options, logger) => {
  return new Server(compiler, options, logger);
};

class Server {
  constructor(compiler, options = {}, logger) {
    this.compiler = compiler;
    this.options = options;
    this.logger = logger || createLogger(options);

    this.createHttpServer();
  }

  createHttpServer() {
    this.listeningApp = http.createServer((req, res) => {
      return handler(req, res, {
        public: (this.options.devServer && this.options.devServer.contentBase) || cwd
      });
    });
    killable(this.listeningApp);
  }

  listen(port, host, callback) {
    this.listeningApp.listen(port, host, err => {
      this.showStatus();

      if (callback) {
        callback.call(this.listeningApp, err);
      }
    });
  }

  close(callback) {
    this.listeningApp.kill(() => {
      this.logger.info('Project is shutting down...');

      if (callback) {
        callback();
      }
    });
  }

  showStatus() {
    const suffix =
      this.options.inline !== false || this.options.lazy === true
        ? '/'
        : '/webpack-fs-dev-server/';
    const uri = `${createDomain(this.options, this.listeningApp)}${suffix}`;

    this.logger.info(`Project is running at ${info(true, uri)}`);
    this.logger.info(`webpack output is served from ${info(true, this.options.publicPath)}`);
  }
}

export { createServer };
