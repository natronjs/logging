/*
 * natron-logging
 */
"use strict";

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
    let out = console.log;
    if (level === "error" || level === "debug" && !this.debugStdout) {
      out = console.error;
    }
    if (level === "error" && meta && meta.stack) {
      if (meta.stack instanceof Array) {
        msg = meta.stack.join("\n");
      } else {
        msg = meta.stack + "";
      }
    }
    out(timestamp, label, msg || meta);
    this.emit("logged");
    cb(null, true);
  }
}

let defaultLogger = new winston.Logger({
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

let { debug, verbose, info, warn, error } = defaultLogger;

var logger = assign({}, { debug, verbose, info, warn, error });
export { logger };
var colors = chalk;
export { colors };