import _ from 'lodash';


export default class DataMap {
  constructor(data) {
    this._data = {};
    if (data) this.merge(data);
  }

  //
  size() { return _.size(this._data); }
  data() { return this._data; }
  entries() { return _.entries(this._data); }
  keys() { return _.keys(this._data); }
  values() { return _.values(this._data); }

  //
  get(key) { return this._data[key]; }
  has(key) { return _.has(this._data, key); }
  transform(key, value) { return value; }
  set(key, value) { this._data[key] = this.transform(key, value); }
  delete(key) { delete this._data[key]; }
  merge(data) { _.each(data, (value, key) => this.set(key, value)); }
  clear() { this._data = {}; }

  //
  forEach(cb) { return _.each(this._data, cb); }
  mapValues(cb) { return _.mapValues(this._data, cb); }
  mapKeys(cb) { return _.mapKeys(this._data, cb); }
}
