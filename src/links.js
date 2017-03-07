import Datastore from 'nedb-promise';

import Hosts from './Hosts';
import { linksDbPath } from './utils/paths';


const db = process.env.NODE_ENV === 'testing'
  ? new Datastore()
  : new Datastore({ filename: linksDbPath(), autoload: true });

db.ensureIndex({ fieldName: 'projectPath', unique: true });

async function getNextIpAddress(index = 1) {
  const ipAddress = `127.20.17.${index}`;
  const link = await db.findOne({ ipAddress });

  if (link === null) return ipAddress;

  return getNextIpAddress(index + 1);
}

function all() {
  return db.find({});
}

function find(query) {
  if (typeof query === 'string') query = { _id: query };

  return db.findOne(query);
}

async function create(data) {
  const ipAddress = await getNextIpAddress();

  await Hosts.create(ipAddress, data.host);

  return db.insert({ ...data, ipAddress });
}

async function update(_id, data) {
  const link = await find(_id);

  if (link.host !== data.host) {
    await Hosts.update(link.ipAddress, link.host, data.host);
  }

  return db.update({ _id }, { $set: { ...data } });
}

async function remove(_id) {
  const link = await find(_id);

  await Hosts.remove(link.ipAddress, link.host);

  return db.remove({ _id });
}

export default {
  all,
  find,
  create,
  update,
  remove,
};
