import path from 'path';

import { ejectFilePath, buildScriptPath, dockerFilePath } from '../utils/paths';
import { fileExists } from '../utils/storage';
import { clean } from '../utils/misc';
import StackServiceEnv from './service/StackServiceEnv';
import StackServicePorts from './service/StackServicePorts';
import StackServiceVolumes from './service/StackServiceVolumes';
import StackServiceNetworks from './service/StackServiceNetworks';


export default class StackService {
  constructor(stack, data) {
    const service = this;
    this.stack = stack;
    this.env = new StackServiceEnv(service);
    this.ports = new StackServicePorts(service);
    this.volumes = new StackServiceVolumes(service);
    this.networks = new StackServiceNetworks(service);
    if (data) this.merge(data);
  }
  merge(data) {
    if (data.name) this.name = data.name;
    if (data.image) this.image = data.image;
    if (data.shell) this.shell = data.shell;
    if (data.env) this.env.merge(data.env);
    if (data.ports) this.ports.merge(data.ports);
    if (data.volumes) this.volumes.merge(data.volumes);
    if (data.networks) this.networks.merge(data.networks);
  }
  toDockerCompose(target, projectPath, ipAddress) {
    return clean({
      tty: true,
      build: {
        context: projectPath,
        dockerfile: path.relative(projectPath, dockerFilePath(projectPath, this.name)),
      },
      environment: this.env.toDockerCompose(),
      ports: this.ports.toDockerCompose(ipAddress),
      volumes: this.volumes.toDockerCompose(target, projectPath),
      networks: this.networks.toDockerCompose(),
    });
  }
  async toDockerFile(target, projectPath) {
    const scriptPath = buildScriptPath(projectPath, this.name);
    const lines = [`FROM ${this.image}`];

    if (await fileExists(scriptPath)) {
      const scriptBasename = path.basename(scriptPath);
      const scriptRelativePath = path.relative(projectPath, scriptPath);

      lines.push(`COPY ${scriptRelativePath} /tmp`);
      lines.push(`RUN chmod +x /tmp/${scriptBasename}`);
      lines.push(`RUN bash /tmp/${scriptBasename}`);
    }

    if (target === 'prod') {
      const files = [
        ...this.volumes.getSyncedVolumes(projectPath),
        ...this.getEjectedFiles(projectPath),
      ];
      files.forEach(([localPath, remotePath]) => {
        lines.push(`COPY ${localPath} ${remotePath}`);
      });
    }

    return `${lines.join('\n')}\n`;
  }
  getEjectedFiles(projectPath) {
    return this.stack.ejectables.getEjectedFiles().reduce((acc, filename) => {
      const ejectable = this.stack.ejectables.get(filename);
      if (ejectable.service === this.name) {
        acc.push([ejectFilePath(projectPath, filename), ejectable.path]);
      }
      return acc;
    }, []);
  }
}
