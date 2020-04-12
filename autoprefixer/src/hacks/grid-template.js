import Declaration from "../declaration.js";
import utils from "./grid-utils.js";

class GridTemplate extends Declaration {
  static names = ["grid-template"];

  /**
   * Translate grid-template to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes, result) {
    if (prefix !== "-ms-") return super.insert(decl, prefix, prefixes);

    if (decl.parent.some((i) => i.prop === "-ms-grid-rows")) {
      return undefined;
    }

    let gap = utils.getGridGap(decl);

    /**
     * we must insert inherited gap values in some cases:
     * if we are inside media query && if we have no grid-gap value
    */
    let inheritedGap = utils.inheritGridGap(decl, gap);

    let {
      rows,
      columns,
      areas,
    } = utils.parseTemplate({
      decl,
      gap: inheritedGap || gap,
    });

    let hasAreas = Object.keys(areas).length > 0;
    let hasRows = Boolean(rows);
    let hasColumns = Boolean(columns);

    utils.warnGridGap({
      gap,
      hasColumns,
      decl,
      result,
    });

    utils.warnMissedAreas(areas, decl, result);

    if ((hasRows && hasColumns) || hasAreas) {
      decl.cloneBefore({
        prop: "-ms-grid-rows",
        value: rows,
        raws: {},
      });
    }

    if (hasColumns) {
      decl.cloneBefore({
        prop: "-ms-grid-columns",
        value: columns,
        raws: {},
      });
    }

    return decl;
  }
}

export default GridTemplate;
