import _ from 'lodash';
import cp from 'child_process';


export function titleCase(input) {
  return input
    .toLowerCase()
    .split(/[^a-zA-Z0-9]+/)
    .filter(token => token.trim())
    .map(token => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
}

export function clean(input) {
  const predicate = _.negate(_.isNil);
  if (input instanceof Array) return _.filter(input, predicate);
  if (input instanceof Object) return _.pickBy(input, predicate);
  return input;
}

export function exec(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    cp.exec(`${command} ${args.join(' ')}`, options, (error, stdout, stderr) => {
      if (error) reject(error, stderr);
      resolve(stdout, stderr);
    });
  });
}

export function spawn(command, args = [], options = {}) {
  return cp.spawn(command, args, options);
}
