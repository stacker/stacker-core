import os from 'os';
import path from 'path';


//

export function homePath() {
  return path.join(os.homedir(), '.stacker');
}

// stack paths

export function stackFilesPath(projectPath) {
  return path.join(projectPath, 'stacker');
}

export function buildFilesPath(projectPath) {
  return path.join(stackFilesPath(projectPath), 'build');
}

export function dockerComposePath(projectPath) {
  return path.join(buildFilesPath(projectPath), 'docker-compose.yaml');
}

export function dockerFilePath(projectPath, serviceName) {
  return path.join(buildFilesPath(projectPath), `Dockerfile-${serviceName}`);
}

export function dockerFileDir(serviceName) {
  return path.join('stacker', 'build', `Dockerfile-${serviceName}`);
}

export function stackConfigPath(projectPath) {
  return path.join(projectPath, 'stacker.yaml');
}

export function buildScriptPath(projectPath, serviceName) {
  return path.join(stackFilesPath(projectPath), `build-${serviceName}.sh`);
}

export function buildScriptDir(serviceName) {
  return path.join('stacker', `build-${serviceName}.sh`);
}

export function ejectFilePath(projectPath, filename) {
  return path.join(stackFilesPath(projectPath), filename);
}

// misc paths

export function linksDbPath() {
  return path.join(homePath(), 'links.json');
}

export function localBinaryPath(binaryName) {
  return path.join(__dirname, '../../node_modules/.bin', binaryName);
}
