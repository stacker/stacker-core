import DataMap from '../utils/DataMap';


export default class StackVolumes extends DataMap {
  constructor(stack, data) {
    super(data);
    this.stack = stack;
  }
  toDockerCompose() {
    if (this.size() === 0) return null;

    return this.data();
  }
}
