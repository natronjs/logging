/*
 * natron-logging
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _console = require("console");

var _console2 = _interopRequireDefault(_console);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _dateformat = require("dateformat");

var _dateformat2 = _interopRequireDefault(_dateformat);

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var LOG_LEVEL_SYMBOLS = {
  "debug": " ✚ ",
  "verbose": " ✱ ",
  "info": "   ",
  "success": " ✓ ",
  "warn": " ! ",
  "error": " ✖ "
};

exports.LOG_LEVEL_SYMBOLS = LOG_LEVEL_SYMBOLS;

var Logger = (function (_winston$Logger) {
  _inherits(Logger, _winston$Logger);

  function Logger(options) {
    _classCallCheck(this, Logger);

    _get(Object.getPrototypeOf(Logger.prototype), "constructor", this).call(this, (0, _objectAssign2["default"])({}, options, {
      levels: {
        "debug": 0,
        "verbose": 1,
        "info": 2,
        "success": 3,
        "warn": 4,
        "error": 5
      },
      colors: {
        "debug": "blue",
        "verbose": "cyan",
        "info": "white",
        "success": "green",
        "warn": "yellow",
        "error": "red"
      },
      exitOnError: false
    }));
  }

  return Logger;
})(_winston2["default"].Logger);

exports.Logger = Logger;

var ConsoleTransport = (function (_winston$transports$Console) {
  _inherits(ConsoleTransport, _winston$transports$Console);

  function ConsoleTransport(options) {
    var _this = this;

    _classCallCheck(this, ConsoleTransport);

    _get(Object.getPrototypeOf(ConsoleTransport.prototype), "constructor", this).call(this, options);
    if (typeof this.timestamp === "string") {
      (function () {
        var tsFormat = _this.timestamp;
        _this.timestamp = function () {
          return tsFormat && (0, _dateformat2["default"])(tsFormat);
        };
      })();
    } else if (this.timestamp === null) {
      this.timestamp = function () {
        return (0, _dateformat2["default"])("dd mmm HH:MM:ss");
      };
    }
    this.handleExceptions = true;
  }

  _createClass(ConsoleTransport, [{
    key: "log",
    value: function log(level, msg, meta, cb) {
      if (this.silent) {
        return cb(null, true);
      }

      var parts = [];
      if (this.timestamp instanceof Function) {
        var timestamp = this.timestamp();
        if (timestamp) {
          parts.push(_chalk2["default"].gray(timestamp));
        }
      }
      var levelLabel = LOG_LEVEL_SYMBOLS[level] || level;
      parts.push(_winston2["default"].config.colorize(level, levelLabel));
      if (this.label) {
        parts.push("[" + this.label + "]");
      }
      if (msg && meta && meta.label) {
        parts.push("[" + meta.label + "]");
      }
      if (level === "error" && meta && meta.stack) {
        if (meta.stack instanceof Array) {
          msg = meta.stack.join("\n");
        } else {
          msg = String(meta.stack);
        }
      }
      parts.push(msg || meta);

      var out = ConsoleTransport.out.std;
      switch (level) {
        case "warn":
        case "error":
          {
            out = ConsoleTransport.out.err;
            break;
          }
        case "debug":
          {
            if (!this.debugStdout) {
              out = ConsoleTransport.out.err;
            }
            break;
          }
      }
      out.apply(undefined, parts);

      this.emit("logged");
      cb(null, true);
    }
  }], [{
    key: "out",
    value: (function (_ref) {
      var std = _ref.info;
      var err = _ref.error;

      return {
        std: std.bind(_console2["default"]),
        err: err.bind(_console2["default"])
      };
    })(_console.Console.prototype),
    enumerable: true
  }]);

  return ConsoleTransport;
})(_winston2["default"].transports.Console);

exports.ConsoleTransport = ConsoleTransport;