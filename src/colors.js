/*
 * natron-logging
 */
import {constructor as Chalk} from "chalk";

export class Colors extends Chalk {

  static create(options?: object): Colors {
    return new (class extends Colors {
      constructor(options?: object) {
        super(options);
        if (options && options.alias) {
          let prototype = this.constructor.prototype;
          for (let name of Object.keys(options.alias)) {
            prototype[name] = this[options.alias[name]];
          }
        }
      }
    })(options);
  }

  none(...args: any): string {
    return args.join(" ");
  }
}
