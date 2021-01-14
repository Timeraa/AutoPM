import packageJson from "package-json";

export default async function (
	module: string
): Promise<moduleVersions | { error: boolean }> {
	try {
		const moduleData = await packageJson(module, {
			allVersions: true
		});
		return {
			versionTags: moduleData["dist-tags"],
			versions: Object.values(moduleData["versions"]).map(v => {
				if (v.deprecated)
					return { version: v.version, deprecated: v.deprecated };
				else return { version: v.version };
			})
		};
	} catch (_) {
		return { error: true };
	}
}

interface moduleVersions {
	versionTags: {
		latest: string;
		[name: string]: string;
	};
	versions: {
		version: string;
		deprecated?: string;
	}[];
}

export function instanceOfModuleVersions(
	object: any
): object is moduleVersions {
	return "versionTags" && "versions" in object;
}
