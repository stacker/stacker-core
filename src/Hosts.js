import os from 'os';
import dns from 'dns';

import { localBinaryPath } from './utils/paths';
import { exec } from './utils/misc';


const hostilePath = localBinaryPath('hostile');

function sudoExecAll(commands) {
  // TODO: escape the content inside quotes
  return exec('sudo sh', ['-c', `"${commands.join(' && ')}"`]);
}

function create(ipAddress, host) {
  return sudoExecAll([
    `ifconfig lo0 alias ${ipAddress}`,
    `${hostilePath} set ${ipAddress} ${host}`,
  ]);
}

function update(ipAddress, oldHost, newHost) {
  return sudoExecAll([
    `${hostilePath} remove ${oldHost}`,
    `${hostilePath} set ${ipAddress} ${newHost}`,
  ]);
}

function remove(ipAddress, host) {
  return sudoExecAll([
    `${hostilePath} remove ${host}`,
    `ifconfig lo0 -alias ${ipAddress}`,
  ]);
}

function ipAddressExists(ipAddress) {
  const interfaces = os.networkInterfaces();
  const result = interfaces.lo0.find(alias => alias.address === ipAddress);

  return Promise.resolve(!!result);
}

function hostExists(ipAddress, host) {
  return new Promise((resolve, reject) => {
    dns.lookup(host, (error, result) => {
      if (error) reject(error);
      resolve(result === ipAddress);
    });
  });
}

async function ensure(ipAddress, host) {
  if (await ipAddressExists(ipAddress) && await hostExists(ipAddress, host)) return;

  return create(ipAddress, host);
}

export default {
  create,
  update,
  remove,
  ensure,
};
