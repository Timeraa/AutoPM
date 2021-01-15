export const MODULENAMEREGEX =
		"(@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~/]*",
	IMPORTREGEX = new RegExp(
		`import(\\s([^"'\`]*\\sfrom\\s)?(["'\`])(${MODULENAMEREGEX})\\3|\\((["'\`])(${MODULENAMEREGEX})\\5\\));?`,
		"g"
	),
	REQUIREREGEX = new RegExp(
		`require\\((["'\`])(${MODULENAMEREGEX})\\1\\)`,
		"g"
	);
