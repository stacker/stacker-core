import sudo from 'sudo-prompt';

import { localBinaryPath } from './utils/paths';


const hostilePath = localBinaryPath('hostile');

function exec(commands) {
  return new Promise((resolve, reject) => {
    sudo.exec(`sh -c "${commands.join('; ')}"`, { name: 'Stacker' }, (error, stdout, stderr) => {
      if (error) reject(error, stderr);
      resolve(stdout, stderr);
    });
  });
}

function create(ip, host) {
  return exec([
    `ifconfig lo0 alias ${ip}`,
    `${hostilePath} set ${ip} ${host}`,
  ]);
}

function update(ip, oldHost, newHost) {
  return exec([
    `${hostilePath} remove ${oldHost}`,
    `${hostilePath} set ${ip} ${newHost}`,
  ]);
}

function remove(ip, host) {
  return exec([
    `${hostilePath} remove ${host}`,
    `ifconfig lo0 -alias ${ip}`,
  ]);
}

export default {
  create,
  update,
  remove,
};
