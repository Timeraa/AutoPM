#!/usr/bin/env node
import "source-map-support/register";
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
    recheck(): void;
    get missingModules(): string[];
    /**
     * Installs missing dependencies.
     */
    installMissing(): Promise<void>;
    /**
     * Uninstalls unused dependencies.
     */
    uninstallUnused(): Promise<void>;
    private exec;
    private updateUnused;
}
