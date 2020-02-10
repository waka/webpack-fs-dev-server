"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = exports.info = void 0;

var info = function info(useColor, msg) {
  if (useColor) {
    // Make text blue and bold, so it *pops*
    return "\x1B[1m\x1B[34m".concat(msg, "\x1B[39m\x1B[22m");
  }

  return msg;
};

exports.info = info;

var error = function error(useColor, msg) {
  if (useColor) {
    // Make text red and bold, so it *pops*
    return "\x1B[1m\x1B[31m".concat(msg, "\x1B[39m\x1B[22m");
  }

  return msg;
};

exports.error = error;