"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLogger = void 0;

var _webpackLog = _interopRequireDefault(require("webpack-log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createLogger = function createLogger() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var level = options.level || 'info';

  if (options.quiet) {
    level = 'silent';
  }

  return (0, _webpackLog["default"])({
    name: 'webpack-fs-dev-server',
    level: level,
    timestamp: options.logTime
  });
};

exports.createLogger = createLogger;