import OldValue from '../old-value.js';
import Value from '../value.js';

class Pixelated extends Value {
  static names = ['pixelated']

  /**
   * Use non-standard name for WebKit and Firefox
   */
  replace (string, prefix) {
    if (prefix === '-webkit-') {
      return string.replace(this.regexp(), '$1-webkit-optimize-contrast')
    }
    if (prefix === '-moz-') {
      return string.replace(this.regexp(), '$1-moz-crisp-edges')
    }
    return super.replace(string, prefix)
  }

  /**
   * Different name for WebKit and Firefox
   */
  old (prefix) {
    if (prefix === '-webkit-') {
      return new OldValue(this.name, '-webkit-optimize-contrast')
    }
    if (prefix === '-moz-') {
      return new OldValue(this.name, '-moz-crisp-edges')
    }
    return super.old(prefix)
  }
}

export default Pixelated;
