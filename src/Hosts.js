import os from 'os';
import dns from 'dns';
import path from 'path';

import { exec } from './utils/misc';


const hostilePath = path.dirname(require.resolve('hostile'));
const hostileBinary = path.join(hostilePath, 'bin/cmd.js');

function sudoExecAll(commands) {
  // TODO: escape the content inside quotes
  return exec('sudo sh', ['-c', `"${commands.join(' && ')}"`]);
}

function create(ipAddress, host) {
  return sudoExecAll([
    `ifconfig lo0 alias ${ipAddress}`,
    `${hostileBinary} set ${ipAddress} ${host}`,
  ]);
}

function update(ipAddress, oldHost, newHost) {
  return sudoExecAll([
    `${hostileBinary} remove ${oldHost}`,
    `${hostileBinary} set ${ipAddress} ${newHost}`,
  ]);
}

function remove(ipAddress, host) {
  return sudoExecAll([
    `${hostileBinary} remove ${host}`,
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
