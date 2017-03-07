import path from 'path';

import DataSet from '../../utils/DataSet';


export default class StackServiceVolumes extends DataSet {
  constructor(service, data) {
    super(data);
    this.service = service;
  }
  toDockerCompose(target, projectPath) {
    if (target === 'dev') {
      return [
        ...this.getPersistentVolumes(),
        ...this.getSyncedVolumes(projectPath).map(pair => pair.join(':')),
        ...this.service.getEjectedFiles(projectPath).map(pair => pair.join(':')),
      ];
    } else if (target === 'prod') {
      return this.getPersistentVolumes();
    }
  }
  getPersistentVolumes() {
    return this.values().filter(value => this.isVolumePersistent(value));
  }
  getSyncedVolumes(projectPath) {
    return this.values().reduce((acc, value) => {
      if (!this.isVolumePersistent(value)) {
        const tokens = value.split(':');
        tokens[0] = path.resolve(projectPath, tokens[0]);
        acc.push(tokens);
      }
      return acc;
    }, []);
  }
  isVolumePersistent(value) {
    const tokens = value.split(':');
    if (tokens.length === 1) return true;
    if (tokens[0].match(/^[^.~/]/)) return true;
    return false;
  }
}
