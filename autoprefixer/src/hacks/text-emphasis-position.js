import Declaration from '../declaration.js';

class TextEmphasisPosition extends Declaration {
  static names = ['text-emphasis-position']

  set (decl, prefix) {
    if (prefix === '-webkit-') {
      decl.value = decl.value.replace(/\s*(right|left)\s*/i, '')
    }
    return super.set(decl, prefix)
  }
}

export default TextEmphasisPosition;
