import { path } from "../../deps.js";

//import glob from "glob";
import postcss from "../../postcss/src/postcss.js";

import transformer from "./lib/transformer.js";
import { hasPromises } from "./lib/helpers.js";

export default postcss.plugin("postcss-functions", (opts = {}) => {
  const functions = opts.functions || {};
  let globs = opts.glob || [];

  if (!Array.isArray(globs)) {
    globs = [globs];
  }

  globs.forEach((pattern) => {
    const regex = path.globToRegExp(pattern);
    path.walkSync(Deno.cwd(), { match: [regex] }).forEach(async (file) => {
      const name = path.basename(file, path.extname(file));
      functions[name] = (await import(file)).default;
    });
    /*
    glob.sync(pattern).forEach(async (file) => {
      const name = path.basename(file, path.extname(file));
      functions[name] = await import(file);
    });
    */
  });

  const transform = transformer(functions);

  return (css) => {
    const promises = [];
    css.walk((node) => {
      promises.push(transform(node));
    });

    if (hasPromises(promises)) {
      return Promise.all(promises);
    }
  };
});
