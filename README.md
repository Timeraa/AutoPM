# Auto Package Manager

Simple module to detect unused dependencies and missing dependencies and functions to automatically install/remove those.

## Compatability

Uses yarn if you have yarn. (Detected by project's `yarn.lock`)

AutoPM is run by default in [DevScript](https://www.npmjs.com/package/ts-devscript).

## Installation

```bash
# global
npm i -g autopm

# npm
npm i autopm

# yarn
yarn add autopm
```

## Usage

```TypeScript
import AutoPM from "autopm";

//* Automatically checks the process.cwd() if not specified
const aPM = new AutoPM();

//* Console log unused
console.log(aPM.unusedModules, aPM.missingModules);

aPM.recheck(); //* Re-check the folder
aPM.installMissing(); //* Promise<void> Installs missing dependencies.
aPM.uninstallUnused(); //* Promise<void> Uninstalls unused dependencies.
```
