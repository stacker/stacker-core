import DataSet from '../../utils/DataSet';


export default class StackServiceNetworks extends DataSet {
  constructor(service, data) {
    super(data);
    this.service = service;
  }
  toDockerCompose() {
    if (this.size() === 0) return null;

    return this.data();
  }
}
