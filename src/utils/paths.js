import os from 'os';
import path from 'path';


//

export function homePath() {
  return path.join(os.homedir(), '.stacker');
}

// stack paths

export function stackerConfigPath(projectPath) {
  return path.join(projectPath, 'stacker.yaml');
}

export function stackerPath(projectPath) {
  return path.join(projectPath, 'stacker');
}

export function buildPath(projectPath) {
  return path.join(stackerPath(projectPath), 'build');
}

export function dockerComposePath(projectPath) {
  return path.join(buildPath(projectPath), 'docker-compose.yaml');
}

export function dockerFilePath(projectPath, serviceName) {
  return path.join(buildPath(projectPath), `Dockerfile-${serviceName}`);
}

export function buildScriptPath(projectPath, serviceName) {
  return path.join(stackerPath(projectPath), `build-${serviceName}.sh`);
}

export function ejectFilePath(projectPath, filename) {
  return path.join(stackerPath(projectPath), filename);
}

// misc paths

export function linksDbPath() {
  return path.join(homePath(), 'links.json');
}
