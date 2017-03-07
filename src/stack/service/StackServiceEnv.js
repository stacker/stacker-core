import DataMap from '../../utils/DataMap';


export default class StackServiceEnv extends DataMap {
  constructor(service, data) {
    super(data);
    this.service = service;
  }
  toDockerCompose() {
    return this.entries().map(entry => entry.join('='));
  }
}
