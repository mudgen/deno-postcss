import Declaration from '../declaration.js';

class ColorAdjust extends Declaration {
  static names = ['color-adjust', 'print-color-adjust']

  /**
   * Change property name for WebKit-based browsers
   */
  prefixed (prop, prefix) {
    return prefix + 'print-color-adjust'
  }

  /**
   * Return property name by spec
   */
  normalize () {
    return 'color-adjust'
  }
}

export default ColorAdjust;
