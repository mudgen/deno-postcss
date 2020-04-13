import vendor from "../../postcss/src/vendor.js";
import Declaration from "./declaration.js";
import Resolution from "./resolution.js";
import Transition from "./transition.js";
import Processor from "./processor.js";
import Supports from "./supports.js";
import Browsers from "./browsers.js";
import Selector from "./selector.js";
import AtRule from "./at-rule.js";
import Value from "./value.js";
import utils from "./utils.js";
async function exec() {
  //Selector.hack(require('./hacks/fullscreen.js'))
  Selector.hack(await import("./hacks/fullscreen.js"));
  Selector.hack(await import("./hacks/placeholder.js"));
  Declaration.hack(await import("./hacks/flex.js"));
  Declaration.hack(await import("./hacks/order.js"));
  Declaration.hack(await import("./hacks/filter.js"));
  Declaration.hack(await import("./hacks/grid-end.js"));
  Declaration.hack(await import("./hacks/animation.js"));
  Declaration.hack(await import("./hacks/flex-flow.js"));
  Declaration.hack(await import("./hacks/flex-grow.js"));
  Declaration.hack(await import("./hacks/flex-wrap.js"));
  Declaration.hack(await import("./hacks/grid-area.js"));
  Declaration.hack(await import("./hacks/place-self.js"));
  Declaration.hack(await import("./hacks/grid-start.js"));
  Declaration.hack(await import("./hacks/align-self.js"));
  Declaration.hack(await import("./hacks/appearance.js"));
  Declaration.hack(await import("./hacks/flex-basis.js"));
  Declaration.hack(await import("./hacks/mask-border.js"));
  Declaration.hack(await import("./hacks/mask-composite.js"));
  Declaration.hack(await import("./hacks/align-items.js"));
  Declaration.hack(await import("./hacks/user-select.js"));
  Declaration.hack(await import("./hacks/flex-shrink.js"));
  Declaration.hack(await import("./hacks/break-props.js"));
  Declaration.hack(await import("./hacks/color-adjust.js"));
  Declaration.hack(await import("./hacks/writing-mode.js"));
  Declaration.hack(await import("./hacks/border-image.js"));
  Declaration.hack(await import("./hacks/align-content.js"));
  Declaration.hack(await import("./hacks/border-radius.js"));
  Declaration.hack(await import("./hacks/block-logical.js"));
  Declaration.hack(await import("./hacks/grid-template.js"));
  Declaration.hack(await import("./hacks/inline-logical.js"));
  Declaration.hack(await import("./hacks/grid-row-align.js"));
  Declaration.hack(await import("./hacks/transform-decl.js"));
  Declaration.hack(await import("./hacks/flex-direction.js"));
  Declaration.hack(await import("./hacks/image-rendering.js"));
  Declaration.hack(await import("./hacks/backdrop-filter.js"));
  Declaration.hack(await import("./hacks/background-clip.js"));
  Declaration.hack(await import("./hacks/text-decoration.js"));
  Declaration.hack(await import("./hacks/justify-content.js"));
  Declaration.hack(await import("./hacks/background-size.js"));
  Declaration.hack(await import("./hacks/grid-row-column.js"));
  Declaration.hack(await import("./hacks/grid-rows-columns.js"));
  Declaration.hack(await import("./hacks/grid-column-align.js"));
  Declaration.hack(await import("./hacks/overscroll-behavior.js"));
  Declaration.hack(await import("./hacks/grid-template-areas.js"));
  Declaration.hack(await import("./hacks/text-emphasis-position.js"));
  Declaration.hack(await import("./hacks/text-decoration-skip-ink.js"));
  Value.hack(await import("./hacks/gradient.js"));
  Value.hack(await import("./hacks/intrinsic.js"));
  Value.hack(await import("./hacks/pixelated.js"));
  Value.hack(await import("./hacks/image-set.js"));
  Value.hack(await import("./hacks/cross-fade.js"));
  Value.hack(await import("./hacks/display-flex.js"));
  Value.hack(await import("./hacks/display-grid.js"));
  Value.hack(await import("./hacks/filter-value.js"));
}
await exec();

let declsCache = {};

class Prefixes {
  constructor(data, browsers, options = {}) {
    this.data = data;
    this.browsers = browsers;
    this.options = options;
    [this.add, this.remove] = this.preprocess(this.select(this.data));
    this.transition = new Transition(this);
    this.processor = new Processor(this);
  }

  /**
   * Return clone instance to remove all prefixes
   */
  cleaner() {
    if (this.cleanerCache) {
      return this.cleanerCache;
    }

    if (this.browsers.selected.length) {
      let empty = new Browsers(this.browsers.data, []);
      this.cleanerCache = new Prefixes(this.data, empty, this.options);
    } else {
      return this;
    }

    return this.cleanerCache;
  }

  /**
   * Select prefixes from data, which is necessary for selected browsers
   */
  select(list) {
    let selected = { add: {}, remove: {} };

    for (let name in list) {
      let data = list[name];
      let add = data.browsers.map((i) => {
        let params = i.split(" ");
        return {
          browser: `${params[0]} ${params[1]}`,
          note: params[2],
        };
      });

      let notes = add
        .filter((i) => i.note)
        .map((i) => `${this.browsers.prefix(i.browser)} ${i.note}`);
      notes = utils.uniq(notes);

      add = add
        .filter((i) => this.browsers.isSelected(i.browser))
        .map((i) => {
          let prefix = this.browsers.prefix(i.browser);
          if (i.note) {
            return `${prefix} ${i.note}`;
          } else {
            return prefix;
          }
        });
      add = this.sort(utils.uniq(add));

      if (this.options.flexbox === "no-2009") {
        add = add.filter((i) => !i.includes("2009"));
      }

      let all = data.browsers.map((i) => this.browsers.prefix(i));
      if (data.mistakes) {
        all = all.concat(data.mistakes);
      }
      all = all.concat(notes);
      all = utils.uniq(all);

      if (add.length) {
        selected.add[name] = add;
        if (add.length < all.length) {
          selected.remove[name] = all.filter((i) => !add.includes(i));
        }
      } else {
        selected.remove[name] = all;
      }
    }

    return selected;
  }

  /**
   * Sort vendor prefixes
   */
  sort(prefixes) {
    return prefixes.sort((a, b) => {
      let aLength = utils.removeNote(a).length;
      let bLength = utils.removeNote(b).length;

      if (aLength === bLength) {
        return b.length - a.length;
      } else {
        return bLength - aLength;
      }
    });
  }

  /**
   * Cache prefixes data to fast CSS processing
   */
  preprocess(selected) {
    let add = {
      "selectors": [],
      "@supports": new Supports(Prefixes, this),
    };
    for (let name in selected.add) {
      let prefixes = selected.add[name];
      if (name === "@keyframes" || name === "@viewport") {
        add[name] = new AtRule(name, prefixes, this);
      } else if (name === "@resolution") {
        add[name] = new Resolution(name, prefixes, this);
      } else if (this.data[name].selector) {
        add.selectors.push(Selector.load(name, prefixes, this));
      } else {
        let props = this.data[name].props;

        if (props) {
          let value = Value.load(name, prefixes, this);
          for (let prop of props) {
            if (!add[prop]) {
              add[prop] = { values: [] };
            }
            add[prop].values.push(value);
          }
        } else {
          let values = (add[name] && add[name].values) || [];
          add[name] = Declaration.load(name, prefixes, this);
          add[name].values = values;
        }
      }
    }

    let remove = { selectors: [] };
    for (let name in selected.remove) {
      let prefixes = selected.remove[name];
      if (this.data[name].selector) {
        let selector = Selector.load(name, prefixes);
        for (let prefix of prefixes) {
          remove.selectors.push(selector.old(prefix));
        }
      } else if (name === "@keyframes" || name === "@viewport") {
        for (let prefix of prefixes) {
          let prefixed = `@${prefix}${name.slice(1)}`;
          remove[prefixed] = { remove: true };
        }
      } else if (name === "@resolution") {
        remove[name] = new Resolution(name, prefixes, this);
      } else {
        let props = this.data[name].props;
        if (props) {
          let value = Value.load(name, [], this);
          for (let prefix of prefixes) {
            let old = value.old(prefix);
            if (old) {
              for (let prop of props) {
                if (!remove[prop]) {
                  remove[prop] = {};
                }
                if (!remove[prop].values) {
                  remove[prop].values = [];
                }
                remove[prop].values.push(old);
              }
            }
          }
        } else {
          for (let p of prefixes) {
            let olds = this.decl(name).old(name, p);
            if (name === "align-self") {
              let a = add[name] && add[name].prefixes;
              if (a) {
                if (p === "-webkit- 2009" && a.includes("-webkit-")) {
                  continue;
                } else if (p === "-webkit-" && a.includes("-webkit- 2009")) {
                  continue;
                }
              }
            }
            for (let prefixed of olds) {
              if (!remove[prefixed]) {
                remove[prefixed] = {};
              }
              remove[prefixed].remove = true;
            }
          }
        }
      }
    }

    return [add, remove];
  }

  /**
     * Declaration loader with caching
     */
  decl(prop) {
    let decl = declsCache[prop];

    if (decl) {
      return decl;
    } else {
      declsCache[prop] = Declaration.load(prop);
      return declsCache[prop];
    }
  }

  /**
   * Return unprefixed version of property
   */
  unprefixed(prop) {
    let value = this.normalize(vendor.unprefixed(prop));
    if (value === "flex-direction") {
      value = "flex-flow";
    }
    return value;
  }

  /**
   * Normalize prefix for remover
   */
  normalize(prop) {
    return this.decl(prop).normalize(prop);
  }

  /**
   * Return prefixed version of property
   */
  prefixed(prop, prefix) {
    prop = vendor.unprefixed(prop);
    return this.decl(prop).prefixed(prop, prefix);
  }

  /**
   * Return values, which must be prefixed in selected property
   */
  values(type, prop) {
    let data = this[type];

    let global = data["*"] && data["*"].values;
    let values = data[prop] && data[prop].values;

    if (global && values) {
      return utils.uniq(global.concat(values));
    } else {
      return global || values || [];
    }
  }

  /**
   * Group declaration by unprefixed property to check them
   */
  group(decl) {
    let rule = decl.parent;
    let index = rule.index(decl);
    let { length } = rule.nodes;
    let unprefixed = this.unprefixed(decl.prop);

    let checker = (step, callback) => {
      index += step;
      while (index >= 0 && index < length) {
        let other = rule.nodes[index];
        if (other.type === "decl") {
          if (step === -1 && other.prop === unprefixed) {
            if (!Browsers.withPrefix(other.value)) {
              break;
            }
          }

          if (this.unprefixed(other.prop) !== unprefixed) {
            break;
          } else if (callback(other) === true) {
            return true;
          }

          if (step === +1 && other.prop === unprefixed) {
            if (!Browsers.withPrefix(other.value)) {
              break;
            }
          }
        }

        index += step;
      }
      return false;
    };

    return {
      up(callback) {
        return checker(-1, callback);
      },
      down(callback) {
        return checker(+1, callback);
      },
    };
  }
}

export default Prefixes;
