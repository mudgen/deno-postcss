import parse from "./parse.js";
import walk from "./walk.js";
import stringify from "./stringify.js";

function ValueParser(value) {
  if (this instanceof ValueParser) {
    this.nodes = parse(value);
    return this;
  }
  return new ValueParser(value);
}

ValueParser.prototype.toString = function () {
  return Array.isArray(this.nodes) ? stringify(this.nodes) : "";
};

ValueParser.prototype.walk = function (cb, bubble) {
  walk(this.nodes, cb, bubble);
  return this;
};

import unit from "./unit.js";
ValueParser.unit = unit;

ValueParser.walk = walk;

ValueParser.stringify = stringify;

export default ValueParser;
