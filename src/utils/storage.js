import fs from 'fs-promise';
import yaml from 'js-yaml';


export function loadFile(file) {
  return fs.readFile(file);
}

export function saveFile(file, data) {
  return fs.writeFile(file, data);
}

export function loadYaml(file) {
  return loadFile(file).then(yaml.safeLoad);
}

export function saveYaml(file, data) {
  return saveFile(file, yaml.safeDump(data));
}

export function loadJson(file) {
  return loadFile(file).then(JSON.parse);
}

export function saveJson(file, data) {
  return saveFile(file, JSON.stringify(data));
}

export function fileExists(file) {
  return fs.access(file).then(() => true, () => false);
}
