#!/usr/bin/env node
import "source-map-support/register";
interface deprecatedModules {
    module: string;
    deprecatedMessage: string;
    currentVersion: string;
    latestVersion: string;
    newerNonDeprecatedVersions: string[];
}
interface outdatedModules {
    module: string;
    currentVersion: string;
    latestVersion: string;
    newerNonDeprecatedVersions: string[];
}
/**
 * Auto Package Manager
 */
export default class AutoPM {
    private packageManager;
    private pkgJson;
    path: string;
    exclude: string[];
    usedModules: string[];
    unusedModules: string[];
    unknownModules: string[];
    outdatedModules: outdatedModules[];
    deprecatedModules: deprecatedModules[];
    /**
     * Create a new Auto Package Manager instance.
     * @param path Path to a project containing a package.json in it's root directory.
     * @param exclude Modules to exlcude from unusedModules.
     */
    constructor(options?: {
        path?: string;
        exclude?: string[];
    });
    /**
     * Re-checks module usage.
     */
    recheck(): Promise<void>;
    get missingModules(): string[];
    /**
     * Installs missing dependencies.
     *
     * @param installTypes Installs the types/module of the missing modules as devDependency. (Default: true)
     */
    installMissing(installTypes?: boolean): Promise<void>;
    /**
     * Uninstalls unused dependencies.
     *
     * @param uninstallTypes Uninstalls the types/module of the unused modules if installed. (Default: true)
     */
    uninstallUnused(uninstallTypes?: boolean): Promise<void>;
    /**
     * Upgrades given modules to given versions.
     *
     * @param modules List of dependencies to upgrade to given version.
     * @param devModules List of devDependencies to upgrade to given version.
     */
    upgradeModulesToVersions(modules: {
        module: string;
        version: string;
    }[], devModules: {
        module: string;
        version: string;
    }[]): Promise<void>;
    /**
     * Upgrades all outdated dependencies to the latest version.
     */
    upgradeAllOutdatedToLatest(): Promise<void>;
    /**
     * Upgrades all deprecated dependencies to the latest version.
     */
    upgradeAllDeprecatedToLatest(): Promise<void>;
    private exec;
    private updateUnused;
    private updateOutdatedAndDeprecated;
}
export {};
