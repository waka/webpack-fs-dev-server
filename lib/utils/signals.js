"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupExitSignals = void 0;
var SIGNALS = ['SIGINT', 'SIGTERM'];

var setupExitSignals = function setupExitSignals() {
  var serverData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  SIGNALS.forEach(function (signal) {
    process.on(signal, function () {
      if (serverData.server) {
        // eslint-disable-next-line no-process-exit
        serverData.server.close(function () {
          return process.exit();
        });
      } else {
        // eslint-disable-next-line no-process-exit
        process.exit();
      }
    });
  });
};

exports.setupExitSignals = setupExitSignals;