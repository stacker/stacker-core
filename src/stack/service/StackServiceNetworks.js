import DataSet from '../../utils/DataSet';


export default class StackServiceNetworks extends DataSet {
  constructor(service, data) {
    super(data);
    this.service = service;
  }
  toDockerCompose() {
    return this.values();
  }
}
