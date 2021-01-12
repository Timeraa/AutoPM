# Auto-NPM

Simple script to detect unused dependencies and missing dependencies and functions to automatically install/remove those.

## Compatability

Uses yarn if you have yarn. (Detected by project's `yarn.lock`)

Auto-NPM is run by default in [DevScript](https://www.npmjs.com/package/ts-devscript).

## Installation

```bash
# global
npm i -g auto-npm

# npm
npm i auto-npm

# yarn
yarn add auto-npm
```

## Usage

```TypeScript
import AutoNPM from "auto-npm";

//* Automatically checks the process.cwd() if not specified
const aNPM = new AutoNPM();

//* Console log unused
console.log(aNPM.unusedModules, aNPM.missingModules);

aNPM.recheck(); //* Re-check the folder
aNPM.installMissing(); //* Promise<void> Installs missing dependencies.
aNPM.uninstallUnused(); //* Promise<void> Uninstalls unused dependencies.
```
