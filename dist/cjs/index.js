/*
 * natron-logging
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequire(obj) { return obj && obj.__esModule ? obj["default"] : obj; }

var _chalk = require("chalk");

exports.colors = _interopRequire(_chalk);

var _logger = require("./logger");

Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function get() {
    return _logger.Logger;
  }
});
Object.defineProperty(exports, "ConsoleTransport", {
  enumerable: true,
  get: function get() {
    return _logger.ConsoleTransport;
  }
});

var _util = require("./util");

Object.defineProperty(exports, "wrapConsole", {
  enumerable: true,
  get: function get() {
    return _util.wrapConsole;
  }
});