import fs from 'fs-promise';

import LaravelStack from './templates/laravel/LaravelStack';
import { saveYaml, saveFile, fileExists } from './utils/storage';
import { defaultBuildPath, dockerComposePath, dockerFilePath, ejectFilePath } from './utils/paths';
import { exec, omitEmptyValues } from './utils/misc';
import Links from './Links';


const DEFAULT_TARGET = 'dev';
const DEFAULT_IP = '0.0.0.0';

export default class StackManager {
  constructor(config) {
    this.config = config;
    this.loadStack();
  }

  // init

  loadStack() {
    if (this.config.stack === 'laravel') {
      this.stack = new LaravelStack(this.config.options);
    }
    if (this.config.extra) {
      this.stack.merge(this.config.extra);
    }
  }
  async loadLink() {
    if (!this.link) {
      const projectPath = this.getProjectPath();
      this.link = await Links.find({ projectPath });
    }

    return this.link;
  }

  // setters & getters

  setTarget(target) {
    this.target = target;
  }
  getTarget() {
    return this.target || DEFAULT_TARGET;
  }
  setProjectPath(projectPath) {
    this.projectPath = projectPath;
  }
  getProjectPath() {
    return this.config.projectPath;
  }
  setBuildPath(buildPath) {
    this.buildPath = buildPath;
  }
  getBuildPath() {
    const projectPath = this.getProjectPath();

    return this.buildPath
      || this.config.buildPath
      || defaultBuildPath(projectPath);
  }
  setIpAddress(ipAddress) {
    this.ipAddress = ipAddress;
  }
  getIpAddress() {
    return this.ipAddress
      || (this.link && this.link.ipAddress)
      || DEFAULT_IP;
  }

  // helpers

  makeOutputDir() {
    return fs.ensureDir(this.getBuildPath());
  }
  execDocker(...args) {
    const command = omitEmptyValues(args).join(' ');

    return exec(`docker ${command}`);
  }
  execDockerCompose(...args) {
    const file = dockerComposePath(this.getBuildPath());
    const command = omitEmptyValues(args).join(' ');

    return exec(`docker-compose --file ${file} ${command}`);
  }
  async listContainers(serviceName = null) {
    const stdout = await this.execDockerCompose('ps -q', serviceName);

    return stdout.trim().split('\n');
  }

  // build

  async build() {
    await this.loadLink();
    await this.makeOutputDir();

    return Promise.all([
      this.buildDockerCompose(),
      ...this.buildDockerFiles(),
    ]);
  }
  async buildDockerCompose() {
    const target = this.getTarget();
    const buildPath = this.getBuildPath();
    const ipAddress = this.getIpAddress();
    const projectPath = this.getProjectPath();
    const content = await this.stack.toDockerCompose(target, projectPath, ipAddress);

    return saveYaml(dockerComposePath(buildPath), content);
  }
  async buildDockerFile(service) {
    const target = this.getTarget();
    const buildPath = this.getBuildPath();
    const projectPath = this.getProjectPath();
    const content = await service.toDockerFile(target, projectPath);

    return saveFile(dockerFilePath(buildPath, service.name), content);
  }
  buildDockerFiles() {
    return this.stack.services.values().map((service) => {
      return this.buildDockerFile(service);
    });
  }

  // start, stop & restart

  start(serviceName = null) {
    return this.execDockerCompose('up -d', serviceName);
  }
  stop(serviceName = null) {
    return this.execDockerCompose('down', serviceName);
  }
  restart(serviceName = null) {
    return this.execDockerCompose('restart', serviceName);
  }

  // run

  async run(runnableName) {
    if (this.stack.runnables.has(runnableName)) {
      const runnable = this.stack.runnables.get(runnableName);
      return this.execDockerCompose('exec', runnable.service, runnable.exec);
    }

    throw new Error('Runnable not found.');
  }

  // eject

  async eject(ejectableName) {
    const exists = await this.ejectableFileExists(ejectableName);

    if (exists) throw new Error('The file already exists.');

    const ejectable = this.stack.ejectables.get(ejectableName);

    if (!ejectable) throw new Error('Ejectable not found.');

    const containers = await this.listContainers(ejectable.service);

    if (!containers.length) throw new Error('Container does not exist.');

    return this.copyEjectableFile(containers[0], ejectable.path, ejectableName);
  }
  async ejectableFileExists(localFile) {
    const projectPath = this.getProjectPath();
    const localPath = ejectFilePath(projectPath, localFile);

    return fileExists(localPath);
  }
  async copyEjectableFile(container, remotePath, localFile) {
    const projectPath = this.getProjectPath();
    const localPath = ejectFilePath(projectPath, localFile);

    return this.execDocker(`cp --follow-link ${container}:${remotePath} ${localPath}`);
  }
}
