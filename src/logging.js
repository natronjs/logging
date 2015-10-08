/*
 * natron-logging
 */
import {default as console, Console} from "console";
import assign from "object-assign";
import dateformat from "dateformat";
import winston from "winston";

export const LOG_LEVEL_SYMBOLS = {
  "debug":   " ✚ ",
  "verbose": " ✱ ",
  "info":    "   ",
  "success": " ✓ ",
  "warn":    " ! ",
  "error":   " ✖ ",
};

export class Logger extends winston.Logger {

  constructor(options?: object) {
    super(assign({
      exitOnError: false,
    }, options));
  }
}

export class ConsoleTransport extends winston.transports.Console {

  constructor(options?: object) {
    super(options);
    if (typeof this.timestamp === "string") {
      let tsFormat = this.timestamp;
      this.timestamp = () => tsFormat && dateformat(tsFormat);
    } else if (this.timestamp === null) {
      this.timestamp = () => dateformat("dd mmm HH:MM:ss");
    }
    this.colors = options && options.colors;
    this.handleExceptions = true;
  }

  doColorize(color: Function|string, s: string): string {
    if (this.colors && this.colors[color] instanceof Function) {
      return this.colors[color](s);
    }
    return s;
  }

  log(level: string, msg: string, meta: object, cb: callable): void {
    if (this.silent) {
      return cb(null, true);
    }

    let parts = [];
    if (this.timestamp instanceof Function) {
      let timestamp = this.timestamp();
      if (timestamp) {
        parts.push(this.doColorize("gray", timestamp));
      }
    }
    parts.push(this.doColorize(level, LOG_LEVEL_SYMBOLS[level]));
    if (this.label) {
      parts.push(`[${this.label}]`);
    }
    if (msg && meta && meta.label) {
      parts.push(`[${meta.label}]`);
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
      case "error": {
        out = ConsoleTransport.out.err;
        break;
      }
      case "debug": {
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

  static out = (({info: std, error: err}) => {
    return {
      std: std.bind(console),
      err: err.bind(console),
    };
  })(Console.prototype);
}
