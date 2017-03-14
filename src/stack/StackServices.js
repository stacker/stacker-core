import _ from 'lodash';

import DataMap from '../utils/DataMap';
import StackService from './StackService';


export default class StackServices extends DataMap {
  constructor(stack, data) {
    super(data);
    this.stack = stack;
  }
  transform(key, value) {
    value.name = key;
    return (value instanceof StackService) ? value : new StackService(this.stack, value);
  }
  merge(data) {
    _.each(data, (serviceData, serviceName) => {
      if (this.has(serviceName)) {
        this.get(serviceName).merge(serviceData);
      } else {
        this.set(serviceName, serviceData);
      }
    });
  }
  toDockerCompose(target, projectName, projectPath, ipAddress) {
    if (this.size() === 0) return null;

    return this.mapValues(service => service.toDockerCompose(target, projectName, projectPath, ipAddress));
  }
}
