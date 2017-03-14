import { clean } from './utils/misc';
import StackServices from './stack/StackServices';
import StackNetworks from './stack/StackNetworks';
import StackVolumes from './stack/StackVolumes';
import StackRunnables from './stack/StackRunnables';
import StackEjectables from './stack/StackEjectables';


export default class Stack {
  constructor() {
    const stack = this;
    this.services = new StackServices(stack);
    this.networks = new StackNetworks(stack);
    this.volumes = new StackVolumes(stack);
    this.runnables = new StackRunnables(stack);
    this.ejectables = new StackEjectables(stack);
  }
  merge(data) {
    if (data.services) this.services.merge(data.services);
    if (data.networks) this.networks.merge(data.networks);
    if (data.volumes) this.volumes.merge(data.volumes);
    if (data.runnables) this.runnables.merge(data.runnables);
    if (data.ejectables) this.ejectables.merge(data.ejectables);
  }
  async toDockerCompose(target, projectName, projectPath, ipAddress) {
    await this.ejectables.findEjectedFiles(projectPath);

    return clean({
      version: '3',
      services: this.services.toDockerCompose(target, projectName, projectPath, ipAddress),
      networks: this.networks.toDockerCompose(),
      volumes: this.volumes.toDockerCompose(),
    });
  }
}
