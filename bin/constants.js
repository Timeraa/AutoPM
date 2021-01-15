"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUIREREGEX = exports.IMPORTREGEX = exports.MODULENAMEREGEX = void 0;
exports.MODULENAMEREGEX = "(@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~/]*", exports.IMPORTREGEX = new RegExp("import(\\s([^\"'`]*\\sfrom\\s)?([\"'`])(" + exports.MODULENAMEREGEX + ")\\3|\\(([\"'`])(" + exports.MODULENAMEREGEX + ")\\5\\));?", "g"), exports.REQUIREREGEX = new RegExp("require\\(([\"'`])(" + exports.MODULENAMEREGEX + ")\\1\\)", "g");
//# sourceMappingURL=constants.js.map