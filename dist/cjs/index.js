/*
 * natron-logging
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.wrapConsole = wrapConsole;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _console = require("console");

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _dateformat = require("dateformat");

var _dateformat2 = _interopRequireDefault(_dateformat);

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var Console = (function (_winston$transports$Console) {
  _inherits(Console, _winston$transports$Console);

  function Console(options) {
    _classCallCheck(this, Console);

    _get(Object.getPrototypeOf(Console.prototype), "constructor", this).call(this, options);
    this.logLevelMapping = options && options.logLevelMapping;
  }

  _createClass(Console, [{
    key: "getLabel",
    value: function getLabel(level) {
      var label = undefined;
      if (this.logLevelMapping) {
        label = this.logLevelMapping[level];
      }
      label = _winston2["default"].config.colorize(level, label || "[" + level + "]");
      if (this.label) {
        label += " [" + this.label + "]";
      }
      return label;
    }
  }, {
    key: "log",
    value: function log(level, msg, meta, cb) {
      if (this.silent) {
        return cb(null, true);
      }
      var timestamp = this.timestamp();
      var label = this.getLabel(level);
      if (msg && meta && meta.label) {
        label += " [" + meta.label + "]";
      }
      var out = Console.out.std;
      switch (level) {
        case "warn":
        case "error":
          {
            out = Console.out.err;
            break;
          }
        case "debug":
          {
            if (!this.debugStdout) {
              out = Console.out.err;
            }
            break;
          }
      }
      if (level === "error" && meta && meta.stack) {
        if (meta.stack instanceof Array) {
          msg = meta.stack.join("\n");
        } else {
          msg = String(meta.stack);
        }
      }
      out(timestamp, label, msg || meta);
      this.emit("logged");
      cb(null, true);
    }
  }], [{
    key: "out",
    value: (function (_ref) {
      var std = _ref.info;
      var err = _ref.error;

      return {
        std: std.bind(console),
        err: err.bind(console)
      };
    })(_console.Console.prototype),
    enumerable: true
  }]);

  return Console;
})(_winston2["default"].transports.Console);

var winstonLogger = new _winston2["default"].Logger({
  transports: [new Console({
    level: "debug",
    handleExceptions: true,
    colorize: true,
    prettyPrint: true,
    timestamp: function timestamp() {
      var time = (0, _dateformat2["default"])("dd mmm HH:MM:ss");
      return _chalk2["default"].gray("[" + time + "]");
    },
    logLevelMapping: {
      "debug": "[#]",
      "verbose": "[&]",
      "info": "   ",
      "warn": "[!]",
      "error": "[x]"
    }
  })],
  emitErrs: true,
  exitOnError: false
});

var Logger = (function () {
  function Logger() {
    _classCallCheck(this, Logger);
  }

  _createClass(Logger, [{
    key: "debug",
    value: function debug() {
      winstonLogger.debug.apply(winstonLogger, arguments);
    }
  }, {
    key: "verbose",
    value: function verbose() {
      winstonLogger.verbose.apply(winstonLogger, arguments);
    }
  }, {
    key: "info",
    value: function info() {
      winstonLogger.info.apply(winstonLogger, arguments);
    }
  }, {
    key: "warn",
    value: function warn() {
      winstonLogger.warn.apply(winstonLogger, arguments);
    }
  }, {
    key: "error",
    value: function error() {
      winstonLogger.error.apply(winstonLogger, arguments);
    }
  }]);

  return Logger;
})();

function wrapConsole(logger) {
  var log = console.log;
  var info = console.info;
  var warn = console.warn;
  var error = console.error;

  (0, _objectAssign2["default"])(console, {
    "log": function log() {
      logger.info.apply(logger, arguments);
    },
    "info": function info() {
      logger.info.apply(logger, arguments);
    },
    "warn": function warn() {
      logger.warn.apply(logger, arguments);
    },
    "error": function error() {
      logger.error.apply(logger, arguments);
    }
  });
  return function () {
    (0, _objectAssign2["default"])(console, { log: log, info: info, warn: warn, error: error });
  };
}

var logger = new Logger();
exports.logger = logger;
var colors = _chalk2["default"];
exports.colors = colors;