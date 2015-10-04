/*
 * natron-logging
 */
"use strict";

export { wrapConsole };
import { default as console } from "console";
import assign from "object-assign";

function wrapConsole(logger) {
  let { log, info, warn, error } = console;
  console.log = (...args) => {
    logger.log("info", ...args, {});
  };
  console.info = (...args) => {
    logger.log("info", ...args, {});
  };
  console.warn = (...args) => {
    logger.log("warn", ...args, {});
  };
  console.error = (...args) => {
    logger.log("error", ...args, {});
  };
  return () => {
    assign(console, { log, info, warn, error });
  };
}