"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDomain = void 0;

var _url = _interopRequireDefault(require("url"));

var _internalIp = _interopRequireDefault(require("internal-ip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createDomain = function createDomain(options, server) {
  var protocol = options.https ? 'https' : 'http';
  var hostname = options.useLocalIp ? _internalIp["default"].v4.sync() || 'localhost' : options.host || 'localhost'; // eslint-disable-next-line no-nested-ternary

  var port = server ? server.address().port : 0; // the formatted domain (url without path) of the webpack server

  return _url["default"].format({
    protocol: protocol,
    hostname: hostname,
    port: port
  });
};

exports.createDomain = createDomain;