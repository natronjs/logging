/*
 * natron-logging
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logging = require("./logging");

Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function get() {
    return _logging.Logger;
  }
});
Object.defineProperty(exports, "ConsoleTransport", {
  enumerable: true,
  get: function get() {
    return _logging.ConsoleTransport;
  }
});

var _colors = require("./colors");

Object.defineProperty(exports, "Colors", {
  enumerable: true,
  get: function get() {
    return _colors.Colors;
  }
});

var _util = require("./util");

Object.defineProperty(exports, "wrapConsole", {
  enumerable: true,
  get: function get() {
    return _util.wrapConsole;
  }
});