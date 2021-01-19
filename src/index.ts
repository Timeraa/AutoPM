#!/usr/bin/env node

import "source-map-support/register";

import builtinModules from "builtin-modules";
import { exec } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

import getUsedModules from "./functions/getUsedModules";
import getModuleVersions, {
	instanceOfModuleVersions
} from "./functions/getModuleVersions";
import { compare } from "compare-versions";
import { getAvailableAtTypesOfModules } from "./functions/getAtTypesOfModule";

export interface deprecatedModules {
	module: string;
	deprecatedMessage: string;
	currentVersion: string;
	latestVersion: string;
	newerNonDeprecatedVersions: string[];
}

export interface outdatedModules {
	module: string;
	currentVersion: string;
	latestVersion: string;
	newerNonDeprecatedVersions: string[];
}

export interface changedModules {
	module: string;
	version: string;
	fromVersion?: string;
	devDependency: boolean;
	type: "INSTALLED" | "UPDATED" | "REMOVED";
}

/**
 * Auto Package Manager
 */
export default class AutoPM {
	private packageManager: "npm" | "yarn" = "npm";
	pkgJson;
	path;
	exclude: string[];
	usedModules: string[] = [];
	unusedModules: string[] = [];
	unknownModules: string[] = [];
	outdatedModules: outdatedModules[] = [];
	deprecatedModules: deprecatedModules[] = [];
	changedModules: changedModules[] = [];

	/**
	 * Create a new Auto Package Manager instance.
	 * @param path Path to a project containing a package.json in it's root directory.
	 * @param exclude Modules to exlcude from unusedModules.
	 */
	constructor(
		options: {
			path?: string;
			exclude?: string[];
		} = {
			path: process.cwd(),
			exclude: []
		}
	) {
		this.path = options.path || process.cwd();
		this.exclude = options.exclude || [];
		this.pkgJson = require(resolve(this.path, "package.json"));
		if (this.pkgJson.devDependencies)
			Object.keys(this.pkgJson.devDependencies).forEach(
				m => delete this.pkgJson.dependencies[m]
			);

		if (existsSync(resolve(this.path, "yarn.lock")))
			this.packageManager = "yarn";

		this.recheck();
	}

	/**
	 * Re-checks module usage.
	 */
	async recheck() {
		const modules = await getUsedModules(this.path);
		this.usedModules = modules.usedModules;
		this.unknownModules = modules.unknownModules;
		this.updateUnused();
		await this.updateOutdatedAndDeprecated();
		this.pkgJson = require(resolve(this.path, "package.json"));
		if (this.pkgJson.devDependencies)
			Object.keys(this.pkgJson.devDependencies).forEach(
				m => delete this.pkgJson.dependencies[m]
			);
		this.changedModules = [];
	}

	get missingModules(): string[] {
		if (this.pkgJson.devDependencies)
			return this.usedModules.filter(
				m =>
					!builtinModules.includes(m) &&
					!Object.keys(this.pkgJson.dependencies).includes(m) &&
					!Object.keys(this.pkgJson.devDependencies).includes(m)
			);
		else
			return this.usedModules.filter(
				m =>
					!builtinModules.includes(m) &&
					!Object.keys(this.pkgJson.dependencies).includes(m)
			);
	}

	/**
	 * Installs missing dependencies.
	 *
	 * @param installTypes Installs the types/module of the missing modules as devDependency. (Default: true)
	 */
	async installMissing(installTypes = true) {
		const missing = this.missingModules;

		if (!missing) return;
		const availableTypeModules = await getAvailableAtTypesOfModules(missing);

		await this.exec(
			`${
				this.packageManager === "yarn" ? "yarn add" : "npm install"
			} ${missing.join(" ")}`
		);

		missing.forEach(m =>
			this.changedModules.push({
				module: m,
				devDependency: false,
				version: "latest",
				type: "INSTALLED"
			})
		);

		if (installTypes && availableTypeModules.length) {
			await this.exec(
				`${
					this.packageManager === "yarn"
						? "yarn add --dev"
						: "npm install --save-dev"
				} ${availableTypeModules.join(" ")}`
			);

			availableTypeModules.forEach(m =>
				this.changedModules.push({
					module: m,
					devDependency: true,
					version: "latest",
					type: "INSTALLED"
				})
			);
		}

		this.usedModules.concat(missing);
	}

	/**
	 * Uninstalls unused dependencies.
	 *
	 * @param uninstallTypes Uninstalls the types/module of the unused modules if installed. (Default: true)
	 */
	async uninstallUnused(uninstallTypes = true) {
		if (!this.unusedModules) return;
		const availableTypeModules = this.pkgJson.devDependencies
			? Object.keys(this.pkgJson.devDependencies).filter((module: string) =>
					this.unusedModules.includes(module.replace("@types/", ""))
			  )
			: [];

		await this.exec(
			`${this.packageManager} remove ${
				uninstallTypes
					? this.unusedModules.concat(availableTypeModules).join(" ")
					: this.unusedModules.join(" ")
			}`
		);

		this.unusedModules.forEach(m =>
			this.changedModules.push({
				module: m,
				devDependency: false,
				version: this.pkgJson.dependencies[m],
				type: "REMOVED"
			})
		);

		availableTypeModules.forEach(m =>
			this.changedModules.push({
				module: m,
				devDependency: true,
				version: this.pkgJson.devDependencies[m],
				type: "REMOVED"
			})
		);

		this.unusedModules = [];
	}

	/**
	 * Upgrades given modules to given versions.
	 *
	 * @param modules List of dependencies to upgrade to given version.
	 * @param devModules List of devDependencies to upgrade to given version.
	 */
	async upgradeModulesToVersions(
		modules: { module: string; version: string }[],
		devModules: { module: string; version: string }[]
	) {
		//* Filter out ones that dont exist in pkgJson
		modules = modules.filter(module =>
			Object.keys(this.pkgJson.dependencies).includes(module.module)
		);
		devModules = devModules.filter(
			module =>
				this.pkgJson.devDependencies &&
				Object.keys(this.pkgJson.devDependencies).includes(module.module)
		);

		//* Return if both arrays are empty
		if (!modules.length && !devModules.length) return;

		if (this.packageManager === "yarn") {
			await this.exec(
				`yarn upgrade ${modules
					.concat(devModules)
					.map(module => {
						return `${module.module}@${module.version}`;
					})
					.join(" ")}`
			);
		} else {
			if (modules.length) {
				await this.exec(
					`npm install ${modules
						.map(module => {
							return `${module.module}@${module.version}`;
						})
						.join(" ")}`
				);
			}
			if (devModules.length) {
				await this.exec(
					`npm install --save-dev ${devModules
						.map(module => {
							return `${module.module}@${module.version}`;
						})
						.join(" ")}`
				);
			}
		}

		modules.forEach(m =>
			this.changedModules.push({
				module: m.module,
				devDependency: false,
				version: m.version,
				fromVersion: this.pkgJson.dependencies[m.module],
				type: "UPDATED"
			})
		);

		devModules.forEach(m =>
			this.changedModules.push({
				module: m.module,
				devDependency: true,
				version: m.version,
				fromVersion: this.pkgJson.devDependencies[m.module],
				type: "UPDATED"
			})
		);
	}

	/**
	 * Upgrades all outdated dependencies to the latest version.
	 */
	async upgradeAllOutdatedToLatest() {
		if (!this.outdatedModules) return;
		//* Split the outdatedModules to dependencies and devDependencies.
		const devDependencies = this.outdatedModules.filter(
				module =>
					this.pkgJson.devDependencies &&
					Object.keys(this.pkgJson.devDependencies).includes(module.module)
			),
			dependencies = this.outdatedModules.filter(module =>
				Object.keys(this.pkgJson.dependencies).includes(module.module)
			);
		if (this.packageManager === "yarn")
			await this.exec(
				`yarn upgrade --latest ${this.outdatedModules
					.map(module => {
						return module.module;
					})
					.join(" ")}`
			);
		else {
			if (dependencies.length)
				await this.exec(
					"npm install " +
						dependencies
							.map(dependency => `${dependency.module}@latest`)
							.join(" ")
				);
			if (devDependencies.length)
				await this.exec(
					"npm install --save-dev " +
						dependencies
							.map(dependency => `${dependency.module}@latest`)
							.join(" ")
				);
		}

		dependencies.forEach(m =>
			this.changedModules.push({
				module: m.module,
				devDependency: false,
				version: "latest",
				fromVersion: this.pkgJson.dependencies[m.module],
				type: "UPDATED"
			})
		);

		devDependencies.forEach(m =>
			this.changedModules.push({
				module: m.module,
				devDependency: true,
				version: "latest",
				fromVersion: this.pkgJson.devDependencies[m.module],
				type: "UPDATED"
			})
		);

		this.outdatedModules = [];
	}

	/**
	 * Upgrades all deprecated dependencies to the latest version.
	 */
	async upgradeAllDeprecatedToLatest() {
		if (!this.deprecatedModules) return;
		//* Split the outdatedModules to dependencies and devDependencies.
		const devDependencies = this.deprecatedModules.filter(
				module =>
					this.pkgJson.devDependencies &&
					Object.keys(this.pkgJson.devDependencies).includes(module.module)
			),
			dependencies = this.deprecatedModules.filter(module =>
				Object.keys(this.pkgJson.dependencies).includes(module.module)
			);
		if (this.packageManager === "yarn")
			await this.exec(
				`yarn upgrade --latest ${this.deprecatedModules
					.map(module => {
						return module.module;
					})
					.join(" ")}`
			);
		else {
			if (dependencies.length)
				await this.exec(
					"npm install " +
						dependencies
							.map(dependency => `${dependency.module}@latest`)
							.join(" ")
				);
			if (devDependencies.length)
				await this.exec(
					"npm install --save-dev " +
						dependencies
							.map(dependency => `${dependency.module}@latest`)
							.join(" ")
				);
		}

		dependencies.forEach(m =>
			this.changedModules.push({
				module: m.module,
				devDependency: false,
				version: "latest",
				fromVersion: this.pkgJson.dependencies[m.module],
				type: "UPDATED"
			})
		);

		devDependencies.forEach(m =>
			this.changedModules.push({
				module: m.module,
				devDependency: true,
				version: "latest",
				fromVersion: this.pkgJson.devDependencies[m.module],
				type: "UPDATED"
			})
		);

		this.deprecatedModules = [];
	}

	private async exec(cmd: string) {
		return new Promise<void>((resolve, reject) => {
			const process = exec(cmd);

			process.on("exit", code => {
				if (code === 0) resolve();
				else reject(code);
			});
		});
	}

	private updateUnused() {
		this.unusedModules = Object.keys(this.pkgJson.dependencies)
			.filter(m => !this.usedModules.includes(m))
			.filter(
				m =>
					!(Object.values(this.pkgJson.scripts || {}) as string[]).find(s => {
						if (existsSync(resolve(this.path, "node_modules")))
							return Object.keys(
								JSON.parse(
									readFileSync(
										resolve(this.path, "node_modules", m, "package.json"),
										"utf8"
									)
								).bin || {}
							).find(bin => s.includes(bin));
						else if (existsSync(resolve(this.path, "../", "node_modules")))
							return Object.keys(
								JSON.parse(
									readFileSync(
										resolve(
											this.path,
											"../",
											"node_modules",
											m,
											"package.json"
										),
										"utf8"
									)
								).bin || {}
							).find(bin => s.includes(bin));
						else return true;
					})
			)
			.filter(m => !this.exclude.includes(m))
			.filter(m => !m.includes("@types/"));
	}

	private async updateOutdatedAndDeprecated() {
		const allDeps: {
				[name: string]: string;
			} = this.pkgJson.devDependencies
				? Object.assign(this.pkgJson.dependencies, this.pkgJson.devDependencies)
				: this.pkgJson.dependencies,
			deprecated: deprecatedModules[] = [],
			outdated: outdatedModules[] = [];

		for (const [module, version] of Object.entries(allDeps)) {
			const installedVersion = version.replace("^", ""),
				npmVersions = await getModuleVersions(module);

			//* Something went wrong while getting the versions?
			if (!instanceOfModuleVersions(npmVersions)) continue;

			//* Version is already the same as the lastest one on NPM. (Up-to-date)
			// prettier-ignore
			if (compare(installedVersion, npmVersions.versionTags.latest, "=")) continue;

			//* Get index of the currently installed version in the npm versions array.
			const vIndex = npmVersions.versions.findIndex(
				v => v.version === installedVersion
			);

			//* Make sure the index is found.
			if (vIndex < 0) continue;

			const npmVersion = npmVersions.versions[vIndex];

			//* Check if current version is deprecated.
			if (npmVersion?.deprecated)
				deprecated.push({
					module: module,
					deprecatedMessage: npmVersion.deprecated,
					currentVersion: installedVersion,
					latestVersion: npmVersions.versionTags.latest,
					newerNonDeprecatedVersions: npmVersions.versions
						.filter(v => {
							if (v.deprecated) return false;
							else return compare(installedVersion, v.version, "<");
						})
						.map(v => v.version)
						.reverse()
				});
			else
				outdated.push({
					module: module,
					currentVersion: installedVersion,
					latestVersion: npmVersions.versionTags.latest,
					newerNonDeprecatedVersions: npmVersions.versions
						.filter(v => {
							if (v.deprecated) return false;
							else return compare(installedVersion, v.version, "<");
						})
						.map(v => v.version)
						.reverse()
				});
		}

		this.deprecatedModules = deprecated;
		this.outdatedModules = outdated;
	}
}
