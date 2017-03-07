# Stacker Core

`[badges]`

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
