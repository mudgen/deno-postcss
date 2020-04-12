import Declaration from '../declaration.js';
import utils from '../utils.js';

class BackgroundClip extends Declaration {
  static names = ['background-clip']

  constructor (name, prefixes, all) {
    super(name, prefixes, all)

    if (this.prefixes) {
      this.prefixes = utils.uniq(this.prefixes.map(i => {
        return i === '-ms-' ? '-webkit-' : i
      }))
    }
  }

  check (decl) {
    return decl.value.toLowerCase() === 'text'
  }
}

export default BackgroundClip;
