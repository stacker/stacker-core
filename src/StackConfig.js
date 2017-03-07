import path from 'path';

import { omitEmptyValues } from './utils/misc';
import { stackConfigPath } from './utils/paths';
import { loadYaml, saveYaml } from './utils/storage';


export default class StackConfig {
  static async load(projectPath) {
    try {
      const config = new StackConfig();
      const result = await loadYaml(stackConfigPath(projectPath));

      config.projectPath = projectPath;

      config.stack = result.stack;
      config.options = result.options;
      config.extra = result.extra;

      return config;
    } catch (error) {
      return null;
    }
  }
  static async loadRecursive(projectPath) {
    const config = await this.load(projectPath);

    if (config) return config;

    const parentDir = path.resolve(projectPath, '..');

    if (parentDir === projectPath) return null;

    return this.loadRecursive(parentDir);
  }
  save(projectPath) {
    this.projectPath = projectPath;

    return saveYaml(stackConfigPath(projectPath), omitEmptyValues({
      stack: this.stack,
      options: this.options,
      extra: this.extra,
    }));
  }
}
