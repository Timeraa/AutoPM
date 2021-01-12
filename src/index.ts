#!/usr/bin/env node

import "source-map-support/register";

import builtinModules from "builtin-modules";
import { exec } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

import getUsedModules from "./functions/getUsedModules";

export default class AutoNPM {
	private packageManager: "npm" | "yarn" = "npm";
	private pkgJson;
	path;
	usedModules: string[] = [];
	unusedModules: string[] = [];

	constructor(path: string = process.cwd()) {
		this.path = path;
		this.pkgJson = require(resolve(path, "package.json"));

		if (existsSync(resolve(this.path, "yarn.lock")))
			this.packageManager = "yarn";

		this.recheck();
	}

	recheck() {
		this.usedModules = getUsedModules(this.path);
		this.unusedModules = this.updateUnused();
	}

	get missingModules(): string[] {
		return this.usedModules.filter(
			m =>
				!builtinModules.includes(m) &&
				!Object.keys(this.pkgJson.dependencies).includes(m)
		);
	}

	async installMissing() {
		const missing = this.missingModules;

		if (!missing) return;

		await this.exec(
			`${
				this.packageManager === "yarn" ? "yarn add" : "npm install"
			} ${missing.join(" ")}`
		);

		this.usedModules.concat(missing);
	}

	async uninstallUnused() {
		if (!this.unusedModules) return;

		await this.exec(
			`${this.packageManager} remove ${this.unusedModules.join(" ")}`
		);

		this.unusedModules = [];
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
		return Object.keys(this.pkgJson.dependencies)
			.filter(m => !this.usedModules.includes(m))
			.filter(
				m =>
					!(Object.values(this.pkgJson.scripts || {}) as string[]).find(s =>
						Object.keys(
							JSON.parse(
								readFileSync(
									resolve(this.path, "node_modules", m, "package.json"),
									"utf8"
								)
							).bin || {}
						).find(bin => s.includes(bin))
					)
			);
	}
}
