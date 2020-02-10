import express from 'express';
import http from 'http';
import { createLogger } from './utils/logger';

export default class Server {
  constructor(compiler, options = {}, logger) {
    this.compiler = compiler;
    this.options = options;
    this.logger = logger || createLogger(options);

    this.createApp();
    this.createHttpServer();
  }

  createApp() {
    this.app = new express();
  }

  createHttpServer() {
    this.listeningApp = http.createServer(this.app);
  }

  listen(port, host, callback) {
    this.listeningApp.listen(port, host, (err) => {
      this.showStatus();

      if (callback) {
        callback.call(this.listeningApp, err);
      }
    });
  }
}
