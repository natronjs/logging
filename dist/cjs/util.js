/*
 * natron-logging
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapConsole = wrapConsole;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _console = require("console");

var _console2 = _interopRequireDefault(_console);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function wrapConsole(logger) {
  var log = _console2["default"].log;
  var info = _console2["default"].info;
  var warn = _console2["default"].warn;
  var error = _console2["default"].error;

  _console2["default"].log = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    logger.log.apply(logger, ["info"].concat(_toConsumableArray(args), [{}]));
  };
  _console2["default"].info = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    logger.log.apply(logger, ["info"].concat(_toConsumableArray(args), [{}]));
  };
  _console2["default"].warn = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    logger.log.apply(logger, ["warn"].concat(_toConsumableArray(args), [{}]));
  };
  _console2["default"].error = function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    logger.log.apply(logger, ["error"].concat(_toConsumableArray(args), [{}]));
  };
  return function () {
    (0, _objectAssign2["default"])(_console2["default"], { log: log, info: info, warn: warn, error: error });
  };
}