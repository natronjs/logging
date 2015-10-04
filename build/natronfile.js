/*
 * natron-logging build
 */
import {resolve} from "path";
import {task} from "natron";
import {src, dest} from "natron-vinyl";
import {transform} from "vinyl-tf-babel";

process.chdir(resolve(__dirname, ".."));

function builder(target: string, options?: object) {
  let $src = src(resolve("src", "**/*.js"));
  let $dest = dest(resolve("dist", target));
  return () => ($src
    .pipe(transform(options))
    .pipe($dest)
  );
}

export var build = task.set([
  builder("cjs", {modules: "common"}),
  builder("es6", {blacklist: ["es6"]}),
]);
