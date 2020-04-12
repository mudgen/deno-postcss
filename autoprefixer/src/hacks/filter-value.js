import Value from '../value.js';

class FilterValue extends Value {
  static names = ['filter', 'filter-function']

  constructor (name, prefixes) {
    super(name, prefixes)
    if (name === 'filter-function') {
      this.name = 'filter'
    }
  }
}

export default FilterValue;
