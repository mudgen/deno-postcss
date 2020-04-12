import Declaration from '../declaration.js';

class InlineLogical extends Declaration {
  static names = [
    'border-inline-start', 'border-inline-end',
    'margin-inline-start', 'margin-inline-end',
    'padding-inline-start', 'padding-inline-end',
    'border-start', 'border-end',
    'margin-start', 'margin-end',
    'padding-start', 'padding-end'
  ]

  /**
   * Use old syntax for -moz- and -webkit-
   */
  prefixed (prop, prefix) {
    return prefix + prop.replace('-inline', '')
  }

  /**
   * Return property name by spec
   */
  normalize (prop) {
    return prop.replace(
      /(margin|padding|border)-(start|end)/, '$1-inline-$2'
    )
  }
}

export default InlineLogical;