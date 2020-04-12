import Declaration from '../declaration.js';

const BASIC = [
  'none', 'underline', 'overline', 'line-through',
  'blink', 'inherit', 'initial', 'unset'
]

class TextDecoration extends Declaration {
  static names = ['text-decoration']

  /**
   * Do not add prefixes for basic values.
   */
  check (decl) {
    return decl.value.split(/\s+/).some(i => !BASIC.includes(i))
  }
}

export default TextDecoration;
