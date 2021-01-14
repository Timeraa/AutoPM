import packageJson from "package-json";

/**
 * Returns `{ builtin: true }` if the main module has built-in types.
 *
 * Returns `{ buildin: false }` if the main module has no built-in types and there isn't a specific module for it.
 *
 * Returns `{ builtin: false, typesModule: "@types/module"}` if the main module has no built-in types, but there is a specific module for it.
 *
 * Returns `{ error: true }` if there was no module found with the name inputted.
 * @param module Module to search if it has types
 */
export async function getAtTypesOfModule(
	module: string
): Promise<{
	builtin?: boolean;
	typesModule?: string;
	error?: true;
}> {
	try {
		const moduleData = await packageJson(module, {
			fullMetadata: true
		});
		if (moduleData.types) {
			return { builtin: true };
		} else {
			try {
				const typesModuleData = await packageJson(`@types/${module}`);
				return { builtin: false, typesModule: typesModuleData.name };
			} catch (_) {
				return { builtin: false };
			}
		}
	} catch (_) {
		return { error: true };
	}
}

export async function getAvailableAtTypesOfModules(modules: string[]) {
	const atTypes: string[] = [];
	for (const module of modules) {
		const incTypes = await getAtTypesOfModule(module);
		if (incTypes.typesModule) atTypes.push(incTypes.typesModule);
	}
	return atTypes;
}
