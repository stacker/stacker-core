import DataMap from '../utils/DataMap';
import { ejectFilePath } from '../utils/paths';
import { fileExists } from '../utils/storage';


export default class StackEjectables extends DataMap {
  constructor(stack, data) {
    super(data);
    this.stack = stack;
  }
  async findEjectedFiles(projectPath) {
    const promises = this.keys().map((filename) => {
      const path = ejectFilePath(projectPath, filename);
      return fileExists(path).then(exists => (exists ? filename : false));
    });
    const results = await Promise.all(promises);
    this.ejectedFiles = results.filter(filename => filename);

    return this.ejectedFiles;
  }
  getEjectedFiles() {
    return this.ejectedFiles;
  }
}
