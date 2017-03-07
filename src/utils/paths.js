import os from 'os';
import md5 from 'md5';
import path from 'path';


// build paths

export function homePath() {
  return path.join(os.homedir(), '.stacker');
}

export function defaultBuildPath(projectPath) {
  return path.join(homePath(), md5(projectPath));
}

export function dockerComposePath(outputPath) {
  return path.join(outputPath, 'docker-compose.yaml');
}

export function dockerFilePath(outputPath, serviceName) {
  return path.join(outputPath, `Dockerfile-${serviceName}`);
}

// stack paths

export function stackFilesPath(projectPath) {
  return path.join(projectPath, 'stacker');
}

export function stackConfigPath(projectPath) {
  return path.join(projectPath, 'stacker.yaml');
}

export function buildScriptPath(projectPath, serviceName) {
  return path.join(stackFilesPath(projectPath), `build-${serviceName}.sh`);
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
