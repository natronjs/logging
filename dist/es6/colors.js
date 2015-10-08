/*
 * natron-logging
 */
"use strict";

import { constructor as Chalk } from "chalk";

class Colors extends Chalk {

  static create(options) {
    return new class extends Colors {
      constructor(options) {
        super(options);
        if (options && options.alias) {
          let prototype = this.constructor.prototype;
          for (let name of Object.keys(options.alias)) {
            prototype[name] = this[options.alias[name]];
          }
        }
      }
    }(options);
  }

  none(...args) {
    return args.join(" ");
  }
}

export { Colors };