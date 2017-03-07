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

export function omitEmptyValues(input) {
  const isEmpty = value => value === null || value === undefined || value === '';

  if (input instanceof Array) {
    return _.filter(input, _.negate(isEmpty));
  }
  if (input instanceof Object) {
    return _.omitBy(input, isEmpty);
  }

  return input;
}

export function exec(command, options = {}) {
  return new Promise((resolve, reject) => {
    cp.exec(command, options, (error, stdout, stderr) => {
      if (error) reject(error, stderr);
      resolve(stdout, stderr);
    });
  });
}
