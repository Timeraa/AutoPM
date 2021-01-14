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

//* Console log all used dependencies.
console.log(aPM.usedModules);

//* Console log all unused dependencies.
//* (Installed but never imported / required.)
console.log(aPM.unusedModules);

//* Console log all imported dependencies that dont exist at all.
//* (Imported / required but they don't exist on NPM.)
console.log(aPM.unknownModules);

//* Console log all missing dependencies.
//* (Imported / required but they aren't installed.)
console.log(aPM.missingModules);

//* Console log all outdated dependencies.
console.log(aPM.outdatedModules);

//* Console log all deprecated dependencies.
console.log(aPM.deprecatedModules);

//* Promise<void> Re-check the folder
aPM.recheck();

//* Promise<void> Installs missing dependencies.
aPM.installMissing();

//* Promise<void> Uninstalls unused dependencies.
aPM.uninstallUnused();

//* Promise<void> Upgrades given dependencies to given versions.
//* (First array is normal dependencies, second array is devDependencies.)
aPM.upgradeModulesToVersions([
  {
    module: "axios",
    version: "0.21.0"
  }
], [
  {
    module: "@types/chrome",
    version: "0.0.100"
  }
]);

//* Promise<void> Upgrades all outdated dependencies to the latest version.
aPM.upgradeAllOutdatedToLatest();

//* Promise<void> Upgrades all deprecated dependencies to the latest version.
aPM.upgradeAllDeprecatedToLatest();
```

## Settings

Simply include the setting while creating the AutoPM instance.

```Typescript
const aPM = new AutoPM({ path: "D:\Coding\AutoPM", exclude: ["@types/chrome"] });
```

| Settings | Type          | Description                            | Default       |
| -------- | ------------- | -------------------------------------- | ------------- |
| path     | string        | Path to the directory.                 | process.cwd() |
| exclude  | Array<string> | Modules to exlcude from unusedModules. |               |
