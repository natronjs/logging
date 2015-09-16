/*
 * natron-logging
 */
"use strict";

export { wrapConsole };
import { Console as NativeConsole } from "console";
import assign from "object-assign";
import chalk from "chalk";
import dateformat from "dateformat";
import winston from "winston";

class Console extends winston.transports.Console {

  constructor(options) {
    super(options);
    this.logLevelMapping = options && options.logLevelMapping;
  }

  getLabel(level) {
    let label;
    if (this.logLevelMapping) {
      label = this.logLevelMapping[level];
    }
    label = winston.config.colorize(level, label || `[${ level }]`);
    if (this.label) {
      label += ` [${ this.label }]`;
    }
    return label;
  }

  log(level, msg, meta, cb) {
    if (this.silent) {
      return cb(null, true);
    }
    let timestamp = this.timestamp();
    let label = this.getLabel(level);
    if (msg && meta && meta.label) {
      label += " [" + meta.label + "]";
    }
    let out = Console.out.std;
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

}

let winstonLogger = new winston.Logger({
  transports: [new Console({
    level: "debug",
    handleExceptions: true,
    colorize: true,
    prettyPrint: true,
    timestamp: () => {
      let time = dateformat("dd mmm HH:MM:ss");
      return chalk.gray(`[${ time }]`);
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

class Logger {

  debug(...args) {
    winstonLogger.debug(...args);
  }

  verbose(...args) {
    winstonLogger.verbose(...args);
  }

  info(...args) {
    winstonLogger.info(...args);
  }

  warn(...args) {
    winstonLogger.warn(...args);
  }

  error(...args) {
    winstonLogger.error(...args);
  }
}

function wrapConsole(logger) {
  let { log, info, warn, error } = console;
  assign(console, {
    "log": (...args) => {
      logger.info(...args);
    },
    "info": (...args) => {
      logger.info(...args);
    },
    "warn": (...args) => {
      logger.warn(...args);
    },
    "error": (...args) => {
      logger.error(...args);
    }
  });
  return () => {
    assign(console, { log, info, warn, error });
  };
}

var logger = new Logger();
export { logger };
var colors = chalk;
export { colors };