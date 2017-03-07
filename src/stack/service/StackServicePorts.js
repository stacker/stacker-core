import DataMap from '../../utils/DataMap';


export default class StackServicePorts extends DataMap {
  constructor(service, data) {
    super(data);
    this.service = service;
  }
  toDockerCompose(projectIp) {
    return this.entries().map((entry) => {
      const ports = entry.join(':');
      return projectIp ? `${projectIp}:${ports}` : ports;
    });
  }
}
