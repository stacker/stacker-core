# Stacker Core

[![Twitter Follow](https://img.shields.io/twitter/follow/StackerHQ.svg?style=social?maxAge=2592000)](https://twitter.com/StackerHQ)
[![Version](https://img.shields.io/npm/v/stacker-core.svg)](https://www.npmjs.com/package/stacker-core)
[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/stacker/stacker-core/blob/master/LICENCE)
[![dependencies](https://david-dm.org/stacker/stacker-core.svg)](https://david-dm.org/stacker/stacker-core)
[![devDependency Status](https://david-dm.org/stacker/stacker-core/dev-status.svg)](https://david-dm.org/stacker/stacker-core#info=devDependencies)

## Usage

There are a few predefined NPM scripts available. Run them by typing this in your terminal: `npm run [script]`

| Name        | Description                                           |
| ----------  | ----------------------------------------------------- |
| `build`     | Compiles all ES2015 files to ES5 (legacy code)        |
| `build:dev` | Re-compiles the code whenever a change occurs         |
| `test`      | Runs the tests with Mocha                             |
| `test:dev`  | Re-runs the tests whenever a change occurs            |
| `lint`      | Runs `ESlint` on all files from `./src` and `./tests` |
| `lint:fix`  | Runs `ESlint` and fixes all the inconsistencies       |
| `clean`     | Removes the compiled files                            |

**NOTE:** There is another script `prepublish` that runs before you publish the package to NPM. All it does is to run `clean` and `build`.

## Templates

- [Laravel Template](src/templates/laravel/README.md)
- [Wordpress Template](src/templates/laravel/README.md)
