import { browserslist } from "../../libs/browserslist/src/index.js";
import { agents } from "../../libs/caniuse-lite/src/unpacker/agents.js";
import utils from "./utils.js";

class Browsers {
  /**
     * Return all prefixes for default browser data
     */
  static prefixes() {
    if (this.prefixesCache) {
      return this.prefixesCache;
    }

    this.prefixesCache = [];
    for (let name in agents) {
      this.prefixesCache.push(`-${agents[name].prefix}-`);
    }

    this.prefixesCache = utils
      .uniq(this.prefixesCache)
      .sort((a, b) => b.length - a.length);

    return this.prefixesCache;
  }

  /**
     * Check is value contain any possible prefix
     */
  static withPrefix(value) {
    if (!this.prefixesRegexp) {
      this.prefixesRegexp = new RegExp(this.prefixes().join("|"));
    }

    return this.prefixesRegexp.test(value);
  }

  constructor(data, requirements, options, browserslistOpts) {
    this.data = data;
    this.options = options || {};
    this.browserslistOpts = browserslistOpts || {};
    this.selected = this.parse(requirements);
  }

  /**
     * Return browsers selected by requirements
     */
  parse(requirements) {
    let opts = {};
    for (let i in this.browserslistOpts) {
      opts[i] = this.browserslistOpts[i];
    }
    opts.path = this.options.from;
    opts.env = this.options.env;
    return browserslist(requirements, opts);
  }

  /**
     * Return prefix for selected browser
     */
  prefix(browser) {
    let [name, version] = browser.split(" ");
    let data = this.data[name];

    let prefix = data.prefix_exceptions && data.prefix_exceptions[version];
    if (!prefix) {
      prefix = data.prefix;
    }
    return `-${prefix}-`;
  }

  /**
     * Is browser is selected by requirements
     */
  isSelected(browser) {
    return this.selected.includes(browser);
  }
}

export default Browsers;
