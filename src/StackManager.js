import md5 from 'md5';
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
  getProjectName() {
    return md5(this.getProjectPath()).slice(0, 10);
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
  execDocker(subcommand, args) {
    return exec('docker', [
      subcommand,
      ...args,
    ]);
  }
  spawnDockerCompose(subcommand, args) {
    const file = dockerComposePath(this.getProjectPath());
    const child = spawn('docker-compose', [
      '--file', file,
      '--project-name', this.getProjectName(),
      subcommand,
      ...args,
    ], { stdio: 'inherit' });

    // cancel default SIGINT behaviour
    process.on('SIGINT', () => {});

    return child;
  }
  async listRunningContainers(serviceName) {
    const label = `${this.getProjectName()}.${serviceName}`;
    const stdout = await this.execDocker('ps', clean([
      '-q',
      '--filter', `label=stacker=${label}`,
      '--filter', 'status=running',
    ]));

    return stdout.trim().split('\n').filter(line => line !== '');
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
    const projectName = this.getProjectName();
    const content = await this.stack.toDockerCompose(target, projectName, projectPath, ipAddress);

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
    return this.spawnDockerCompose('up', clean([detached ? '-d' : null]));
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
    return this.spawnDockerCompose('restart', clean([serviceName]));
  }

  // run

  async run(runnableName) {
    if (!this.stack.runnables.has(runnableName)) throw new Error('Runnable not found.');

    const runnable = this.stack.runnables.get(runnableName);
    const shell = this.stack.services.get(runnable.service).shell;

    if (!shell) throw new Error('This service does not have any shell.');

    const containers = await this.listRunningContainers(runnable.service);

    if (!containers.length) throw new Error('You need to start the project first. Run "stacker up".');

    return this.spawnDockerCompose('exec', clean([runnable.service, shell, '-c', runnable.exec]));
  }

  // shell

  async shell(serviceName) {
    const shell = this.stack.services.get(serviceName).shell;

    if (!shell) throw new Error('This service does not have any shell.');

    const containers = await this.listRunningContainers(serviceName);

    if (!containers.length) throw new Error('You need to start the project first. Run "stacker up".');

    return this.spawnDockerCompose('exec', clean([serviceName, shell]));
  }

  // eject

  async eject(ejectableName) {
    if (await this.ejectableFileExists(ejectableName)) throw new Error('The file already exists.');
    if (!this.stack.ejectables.has(ejectableName)) throw new Error('Ejectable not found.');

    const ejectable = this.stack.ejectables.get(ejectableName);
    const containers = await this.listRunningContainers(ejectable.service);

    if (!containers.length) throw new Error('You need to start the project first. Run "stacker up".');

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

    return this.execDocker('cp', clean([
      '--follow-link',
      `${container}:${remotePath} ${localPath}`,
    ]));
  }
}
