import Declaration from '../declaration.js';
import utils from '../utils.js';

class Appearance extends Declaration {
  static names = ['appearance']

  constructor (name, prefixes, all) {
    super(name, prefixes, all)

    if (this.prefixes) {
      this.prefixes = utils.uniq(this.prefixes.map(i => {
        if (i === '-ms-') {
          return '-webkit-'
        }
        return i
      }))
    }
  }
}

export default Appearance;
