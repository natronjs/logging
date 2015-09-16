/*
 * natron-logging
 */
import {Console as NativeConsole} from "console";
import assign from "object-assign";
import chalk from "chalk";
import dateformat from "dateformat";
import winston from "winston";

class Console extends winston.transports.Console {

  constructor(options?: object) {
    super(options);
    this.logLevelMapping = options && options.logLevelMapping;
  }

  getLabel(level: string): string {
    let label;
    if (this.logLevelMapping) {
      label = this.logLevelMapping[level];
    }
    label = winston.config.colorize(level, label || `[${level}]`);
    if (this.label) {
      label += ` [${this.label}]`;
    }
    return label;
  }

  log(level: string, msg: string, meta: object, cb: callable): void {
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
      case "error": {
        out = Console.out.err;
        break;
      }
      case "debug": {
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

  static out = (({info: std, error: err}) => {
    return {
      std: std.bind(console),
      err: err.bind(console),
    };
  })(NativeConsole.prototype);
}

let winstonLogger = new winston.Logger({
  transports: [
    new Console({
      level: "debug",
      handleExceptions: true,
      colorize: true,
      prettyPrint: true,
      timestamp: () => {
        let time = dateformat("dd mmm HH:MM:ss");
        return chalk.gray(`[${time}]`);
      },
      logLevelMapping: {
        "debug":   "[#]",
        "verbose": "[&]",
        "info":    "   ",
        "warn":    "[!]",
        "error":   "[x]",
      },
    }),
  ],
  emitErrs: true,
  exitOnError: false,
});

class Logger {

  debug(...args: any): void {
    winstonLogger.debug(...args);
  }

  verbose(...args: any): void {
    winstonLogger.verbose(...args);
  }

  info(...args: any): void {
    winstonLogger.info(...args);
  }

  warn(...args: any): void {
    winstonLogger.warn(...args);
  }

  error(...args: any): void {
    winstonLogger.error(...args);
  }
}

export function wrapConsole(logger: Logger): Function {
  let {log, info, warn, error} = console;
  assign(console, {
    "log": (...args: any) => {
      logger.info(...args);
    },
    "info": (...args: any) => {
      logger.info(...args);
    },
    "warn": (...args: any) => {
      logger.warn(...args);
    },
    "error": (...args: any) => {
      logger.error(...args);
    },
  });
  return () => {
    assign(console, {log, info, warn, error});
  };
}

export var logger = new Logger();
export var colors = chalk;
