import DataMap from '../utils/DataMap';


export default class StackRunnables extends DataMap {
  constructor(stack, data) {
    super(data);
    this.stack = stack;
  }
}
