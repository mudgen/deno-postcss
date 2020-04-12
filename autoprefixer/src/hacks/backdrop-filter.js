import Declaration from '../declaration.js';
import utils from '../utils.js';

class BackdropFilter extends Declaration {
  static names = ['backdrop-filter']

  constructor (name, prefixes, all) {
    super(name, prefixes, all)

    if (this.prefixes) {
      this.prefixes = utils.uniq(this.prefixes.map(i => {
        return i === '-ms-' ? '-webkit-' : i
      }))
    }
  }
}

export default BackdropFilter;
