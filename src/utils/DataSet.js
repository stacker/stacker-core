import _ from 'lodash';


export default class DataSet {
  constructor(data) {
    this._data = [];
    if (data) this.merge(data);
  }

  //
  size() { return this._data.length; }
  data() { return this._data; }
  values() { return this.data(); }

  //
  has(value) { return _.includes(this._data, value); }
  transform(value) { return value; }
  add(value) { this._data = _.union(this._data, [this.transform(value)]); }
  delete(value) { _.pull(this._data, value); }
  merge(data) { _.each(data, value => this.add(value)); }
  clear() { this._data = []; }

  //
  forEach(cb) { return _.each(this._data, cb); }
  map(cb) { return _.map(this._data, cb); }
}
