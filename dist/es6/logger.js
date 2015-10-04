/*
 * natron-logging
 */
"use strict";

import { default as console, Console } from "console";
import assign from "object-assign";
import chalk from "chalk";
import dateformat from "dateformat";
import winston from "winston";

const LOG_LEVEL_SYMBOLS = {
  "debug": " ✚ ",
  "verbose": " ✱ ",
  "info": "   ",
  "success": " ✓ ",
  "warn": " ! ",
  "error": " ✖ "
};

export { LOG_LEVEL_SYMBOLS };

class Logger extends winston.Logger {

  constructor(options) {
    super(assign({}, options, {
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
}

export { Logger };

class ConsoleTransport extends winston.transports.Console {

  constructor(options) {
    super(options);
    if (typeof this.timestamp === "string") {
      let tsFormat = this.timestamp;
      this.timestamp = () => tsFormat && dateformat(tsFormat);
    } else if (this.timestamp === null) {
      this.timestamp = () => dateformat("dd mmm HH:MM:ss");
    }
    this.handleExceptions = true;
  }

  log(level, msg, meta, cb) {
    if (this.silent) {
      return cb(null, true);
    }

    let parts = [];
    if (this.timestamp instanceof Function) {
      let timestamp = this.timestamp();
      if (timestamp) {
        parts.push(chalk.gray(timestamp));
      }
    }
    let levelLabel = LOG_LEVEL_SYMBOLS[level] || level;
    parts.push(winston.config.colorize(level, levelLabel));
    if (this.label) {
      parts.push(`[${ this.label }]`);
    }
    if (msg && meta && meta.label) {
      parts.push(`[${ meta.label }]`);
    }
    if (level === "error" && meta && meta.stack) {
      if (meta.stack instanceof Array) {
        msg = meta.stack.join("\n");
      } else {
        msg = String(meta.stack);
      }
    }
    parts.push(msg || meta);

    let out = ConsoleTransport.out.std;
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
    out(...parts);

    this.emit("logged");
    cb(null, true);
  }

}

export { ConsoleTransport };