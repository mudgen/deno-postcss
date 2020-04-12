import Declaration from "../declaration.js";
import utils from "./grid-utils.js";

function getGridRows(tpl) {
  return tpl.trim().slice(1, -1).split(/["']\s*["']?/g);
}

class GridTemplateAreas extends Declaration {
  static names = ["grid-template-areas"];

  /**
   * Translate grid-template-areas to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes, result) {
    if (prefix !== "-ms-") return super.insert(decl, prefix, prefixes);

    let hasColumns = false;
    let hasRows = false;
    let parent = decl.parent;
    let gap = utils.getGridGap(decl);
    gap = utils.inheritGridGap(decl, gap) || gap;

    // remove already prefixed rows
    // to prevent doubling prefixes
    parent.walkDecls(/-ms-grid-rows/, (i) => i.remove());

    // add empty tracks to rows
    parent.walkDecls(/grid-template-(rows|columns)/, (trackDecl) => {
      if (trackDecl.prop === "grid-template-rows") {
        hasRows = true;
        let { prop, value } = trackDecl;
        trackDecl.cloneBefore({
          prop: utils.prefixTrackProp({ prop, prefix }),
          value: utils.prefixTrackValue({ value, gap: gap.row }),
        });
      } else {
        hasColumns = true;
      }
    });

    let gridRows = getGridRows(decl.value);

    if (hasColumns && !hasRows && gap.row && gridRows.length > 1) {
      decl.cloneBefore({
        prop: "-ms-grid-rows",
        value: utils.prefixTrackValue({
          value: `repeat(${gridRows.length}, auto)`,
          gap: gap.row,
        }),
        raws: {},
      });
    }

    // warnings
    utils.warnGridGap({
      gap,
      hasColumns,
      decl,
      result,
    });

    let areas = utils.parseGridAreas({
      rows: gridRows,
      gap,
    });

    utils.warnMissedAreas(areas, decl, result);

    return decl;
  }
}

export default GridTemplateAreas;
