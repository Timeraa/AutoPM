"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fast_glob_1 = require("fast-glob");
var fs_1 = require("fs");
var path_1 = require("path");
//@ts-ignore
var require_package_name_1 = __importDefault(require("require-package-name"));
var constants_1 = require("../constants");
function default_1(path) {
    var _a, _b;
    if (path === void 0) { path = process.cwd(); }
    var files = fast_glob_1.sync("**", {
        onlyFiles: true,
        ignore: ["node_modules"],
        cwd: path
    });
    var requiredModules = new Set();
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var contents = fs_1.readFileSync(path_1.resolve(path, file), "utf8"), imports = contents.match(constants_1.IMPORTREGEX) || [], requires = contents.match(constants_1.REQUIREREGEX) || [], modules = imports.concat(requires);
        for (var _c = 0, modules_1 = modules; _c < modules_1.length; _c++) {
            var match = modules_1[_c];
            requiredModules.add(require_package_name_1.default((_b = (_a = new RegExp("([\"'`])(?<moduleName>" + constants_1.MODULENAMEREGEX + ")\\1").exec(match)) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b.moduleName));
        }
    }
    return Array.from(requiredModules.keys());
}
exports.default = default_1;
//# sourceMappingURL=getUsedModules.js.map