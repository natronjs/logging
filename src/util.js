/*
 * natron-logging
 */
import {default as console} from "console";
import assign from "object-assign";

export function wrapConsole(logger: Logger): Function {
  let {log, info, warn, error} = console;
  console.log = (...args: any) => {
    logger.log("info", ...args, {});
  };
  console.info = (...args: any) => {
    logger.log("info", ...args, {});
  };
  console.warn = (...args: any) => {
    logger.log("warn", ...args, {});
  };
  console.error = (...args: any) => {
    logger.log("error", ...args, {});
  };
  return () => {
    assign(console, {log, info, warn, error});
  };
}
