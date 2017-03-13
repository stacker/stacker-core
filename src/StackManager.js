import fs from 'fs-promise';

import LaravelStack from './templates/laravel/LaravelStack';
import { saveYaml, saveFile, fileExists } from './utils/storage';
import { buildPath, dockerComposePath, dockerFilePath, ejectFilePath } from './utils/paths';
import { exec, spawn, clean } from './utils/misc';
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
    return fs.ensureDir(buildPath(this.getProjectPath()));
  }
  execDocker(...args) {
    const command = clean(args).join(' ');

    return exec(`docker ${command}`);
  }
  execDockerCompose(...args) {
    const file = dockerComposePath(this.getProjectPath());
    const command = clean(args).join(' ');

    return exec(`docker-compose --file ${file} ${command}`);
  }
  spawnDockerCompose(...args) {
    const file = dockerComposePath(this.getProjectPath());
    const child = spawn('docker-compose', clean(['--file', file, ...args]), { stdio: 'inherit' });

    // cancel default SIGINT behaviour
    process.on('SIGINT', () => {});

    return child;
  }
  async listContainers(serviceName = null) {
    const stdout = await this.execDockerCompose('ps -q', serviceName);

    return stdout.trim().split('\n');
  }

  // build

  async build() {
    await this.loadLink();
    await this.makeOutputDir();

    await Promise.all([
      this.buildDockerCompose(),
      ...this.buildDockerFiles(),
    ]);

    return this.spawnDockerCompose('build');
  }
  async buildDockerCompose() {
    const target = this.getTarget();
    const ipAddress = this.getIpAddress();
    const projectPath = this.getProjectPath();
    const content = await this.stack.toDockerCompose(target, projectPath, ipAddress);

    return saveYaml(dockerComposePath(projectPath), content);
  }
  async buildDockerFile(service) {
    const target = this.getTarget();
    const projectPath = this.getProjectPath();
    const content = await service.toDockerFile(target, projectPath);

    return saveFile(dockerFilePath(projectPath, service.name), content);
  }
  buildDockerFiles() {
    return this.stack.services.values().map((service) => {
      return this.buildDockerFile(service);
    });
  }

  // up, down & start, stop & restart

  up(detached = false) {
    return this.spawnDockerCompose('up', detached && '-d');
  }
  down() {
    return this.spawnDockerCompose('down');
  }
  start() {
    return this.spawnDockerCompose('start');
  }
  stop() {
    return this.spawnDockerCompose('stop');
  }
  restart(serviceName = null) {
    return this.spawnDockerCompose('restart', serviceName);
  }

  // run

  run(runnableName) {
    if (!this.stack.runnables.has(runnableName)) throw new Error('Runnable not found.');

    const runnable = this.stack.runnables.get(runnableName);
    const serviceName = runnable.service;
    const shell = this.stack.services.get(serviceName).shell;

    if (!shell) throw new Error('This service does not have any shell.');

    return this.spawnDockerCompose('exec', serviceName, shell, '-c', runnable.exec);
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

  // shell

  shell(serviceName) {
    const shell = this.stack.services.get(serviceName).shell;

    if (!shell) throw new Error('This service does not have any shell.');

    return this.spawnDockerCompose('exec', serviceName, shell);
  }
}
