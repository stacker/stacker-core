import DataMap from '../../utils/DataMap';


export default class StackServiceEnv extends DataMap {
  constructor(service, data) {
    super(data);
    this.service = service;
  }
  toDockerCompose() {
    if (this.size() === 0) return null;

    return this.entries().map(entry => entry.join('='));
  }
}
