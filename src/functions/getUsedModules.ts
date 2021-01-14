import { sync as glob } from "fast-glob";
import { readFileSync } from "fs";
import { resolve } from "path";
//@ts-ignore
import name from "require-package-name";

import { IMPORTREGEX, MODULENAMEREGEX, REQUIREREGEX } from "../constants";
import getModuleVersions, {
	instanceOfModuleVersions
} from "./getModuleVersions";

export default async function (path: string = process.cwd()) {
	const files = glob("**", {
		onlyFiles: true,
		ignore: ["node_modules"],
		cwd: path
	});

	let requiredModules: Set<string> = new Set();

	for (const file of files) {
		const contents = readFileSync(resolve(path, file), "utf8"),
			imports = contents.match(IMPORTREGEX) || [],
			requires = contents.match(REQUIREREGEX) || [],
			modules = imports.concat(requires);

		for (const match of modules) {
			requiredModules.add(
				name(
					new RegExp(`(["'\`])(?<moduleName>${MODULENAMEREGEX})\\1`).exec(match)
						?.groups?.moduleName!
				)
			);
		}
	}

	const usedArry: string[] = Array.from(requiredModules.keys()),
		unknownArray: string[] = [];

	usedArry.filter(async module => {
		const versions = await getModuleVersions(module);
		//* Make sure module has versions / is a valid module
		if (!instanceOfModuleVersions(versions)) {
			unknownArray.push(module);
			return false;
		} else {
			return true;
		}
	});

	return { usedModules: usedArry, unknownModules: unknownArray };
}
