import DataMap from '../utils/DataMap';


export default class StackVolumes extends DataMap {
  constructor(stack, data) {
    super(data);
    this.stack = stack;
  }
  toDockerCompose() {
    return this.data();
  }
}
