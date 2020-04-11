import Stringifier from "./stringifier.ts";

function stringify(node, builder) {
  let str = new Stringifier(builder);
  str.stringify(node, undefined);
}

export default stringify;
