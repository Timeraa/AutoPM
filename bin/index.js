#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
var builtin_modules_1 = __importDefault(require("builtin-modules"));
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var getUsedModules_1 = __importDefault(require("./functions/getUsedModules"));
var getModuleVersions_1 = __importStar(require("./functions/getModuleVersions"));
var compare_versions_1 = require("compare-versions");
var getAtTypesOfModule_1 = require("./functions/getAtTypesOfModule");
/**
 * Auto Package Manager
 */
var AutoPM = /** @class */ (function () {
    /**
     * Create a new Auto Package Manager instance.
     * @param path Path to a project containing a package.json in it's root directory.
     * @param exclude Modules to exlcude from unusedModules.
     */
    function AutoPM(options) {
        if (options === void 0) { options = {
            path: process.cwd(),
            exclude: []
        }; }
        this.packageManager = "npm";
        this.usedModules = [];
        this.unusedModules = [];
        this.unknownModules = [];
        this.outdatedModules = [];
        this.deprecatedModules = [];
        this.changedModules = [];
        this.path = options.path || process.cwd();
        this.exclude = options.exclude || [];
        this.pkgJson = require(path_1.resolve(this.path, "package.json"));
        if (fs_1.existsSync(path_1.resolve(this.path, "yarn.lock")))
            this.packageManager = "yarn";
        this.recheck();
    }
    /**
     * Re-checks module usage.
     */
    AutoPM.prototype.recheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getUsedModules_1.default(this.path)];
                    case 1:
                        modules = _a.sent();
                        this.usedModules = modules.usedModules;
                        this.unknownModules = modules.unknownModules;
                        this.updateUnused();
                        return [4 /*yield*/, this.updateOutdatedAndDeprecated()];
                    case 2:
                        _a.sent();
                        this.pkgJson = require(path_1.resolve(this.path, "package.json"));
                        this.changedModules = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(AutoPM.prototype, "missingModules", {
        get: function () {
            var _this = this;
            if (this.pkgJson.devDependencies)
                return this.usedModules.filter(function (m) {
                    return !builtin_modules_1.default.includes(m) &&
                        !Object.keys(_this.pkgJson.dependencies).includes(m) &&
                        !Object.keys(_this.pkgJson.devDependencies).includes(m);
                });
            else
                return this.usedModules.filter(function (m) {
                    return !builtin_modules_1.default.includes(m) &&
                        !Object.keys(_this.pkgJson.dependencies).includes(m);
                });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Installs missing dependencies.
     *
     * @param installTypes Installs the types/module of the missing modules as devDependency. (Default: true)
     */
    AutoPM.prototype.installMissing = function (installTypes) {
        if (installTypes === void 0) { installTypes = true; }
        return __awaiter(this, void 0, void 0, function () {
            var missing, availableTypeModules;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        missing = this.missingModules;
                        if (!missing)
                            return [2 /*return*/];
                        return [4 /*yield*/, getAtTypesOfModule_1.getAvailableAtTypesOfModules(missing)];
                    case 1:
                        availableTypeModules = _a.sent();
                        return [4 /*yield*/, this.exec((this.packageManager === "yarn" ? "yarn add" : "npm install") + " " + missing.join(" "))];
                    case 2:
                        _a.sent();
                        missing.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m,
                                devDependency: false,
                                version: "latest",
                                type: "INSTALLED"
                            });
                        });
                        if (!(installTypes && availableTypeModules.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.exec((this.packageManager === "yarn"
                                ? "yarn add --dev"
                                : "npm install --save-dev") + " " + availableTypeModules.join(" "))];
                    case 3:
                        _a.sent();
                        availableTypeModules.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m,
                                devDependency: true,
                                version: "latest",
                                type: "INSTALLED"
                            });
                        });
                        _a.label = 4;
                    case 4:
                        this.usedModules.concat(missing);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Uninstalls unused dependencies.
     *
     * @param uninstallTypes Uninstalls the types/module of the unused modules if installed. (Default: true)
     */
    AutoPM.prototype.uninstallUnused = function (uninstallTypes) {
        if (uninstallTypes === void 0) { uninstallTypes = true; }
        return __awaiter(this, void 0, void 0, function () {
            var availableTypeModules;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.unusedModules)
                            return [2 /*return*/];
                        availableTypeModules = this.pkgJson.devDependencies
                            ? Object.keys(this.pkgJson.devDependencies).filter(function (module) {
                                return _this.unusedModules.includes(module.replace("@types/", ""));
                            })
                            : [];
                        return [4 /*yield*/, this.exec(this.packageManager + " remove " + (uninstallTypes
                                ? this.unusedModules.concat(availableTypeModules).join(" ")
                                : this.unusedModules.join(" ")))];
                    case 1:
                        _a.sent();
                        this.unusedModules.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m,
                                devDependency: false,
                                version: _this.pkgJson.dependencies[m],
                                type: "REMOVED"
                            });
                        });
                        availableTypeModules.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m,
                                devDependency: true,
                                version: _this.pkgJson.devDependencies[m],
                                type: "REMOVED"
                            });
                        });
                        this.unusedModules = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upgrades given modules to given versions.
     *
     * @param modules List of dependencies to upgrade to given version.
     * @param devModules List of devDependencies to upgrade to given version.
     */
    AutoPM.prototype.upgradeModulesToVersions = function (modules, devModules) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //* Filter out ones that dont exist in pkgJson
                        modules = modules.filter(function (module) {
                            return Object.keys(_this.pkgJson.dependencies).includes(module.module);
                        });
                        devModules = devModules.filter(function (module) {
                            return _this.pkgJson.devDependencies &&
                                Object.keys(_this.pkgJson.devDependencies).includes(module.module);
                        });
                        //* Return if both arrays are empty
                        if (!modules.length && !devModules.length)
                            return [2 /*return*/];
                        if (!(this.packageManager === "yarn")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.exec("yarn upgrade " + modules
                                .concat(devModules)
                                .map(function (module) {
                                return module.module + "@" + module.version;
                            })
                                .join(" "))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!modules.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.exec("npm install " + modules
                                .map(function (module) {
                                return module.module + "@" + module.version;
                            })
                                .join(" "))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!devModules.length) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.exec("npm install --save-dev " + devModules
                                .map(function (module) {
                                return module.module + "@" + module.version;
                            })
                                .join(" "))];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        modules.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m.module,
                                devDependency: false,
                                version: m.version,
                                fromVersion: _this.pkgJson.dependencies[m.module],
                                type: "UPDATED"
                            });
                        });
                        devModules.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m.module,
                                devDependency: true,
                                version: m.version,
                                fromVersion: _this.pkgJson.devDependencies[m.module],
                                type: "UPDATED"
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upgrades all outdated dependencies to the latest version.
     */
    AutoPM.prototype.upgradeAllOutdatedToLatest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var devDependencies, dependencies;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.outdatedModules)
                            return [2 /*return*/];
                        devDependencies = this.outdatedModules.filter(function (module) {
                            return _this.pkgJson.devDependencies &&
                                Object.keys(_this.pkgJson.devDependencies).includes(module.module);
                        }), dependencies = this.outdatedModules.filter(function (module) {
                            return Object.keys(_this.pkgJson.dependencies).includes(module.module);
                        });
                        if (!(this.packageManager === "yarn")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.exec("yarn upgrade --latest " + this.outdatedModules
                                .map(function (module) {
                                return module.module;
                            })
                                .join(" "))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!dependencies.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.exec("npm install " +
                                dependencies
                                    .map(function (dependency) { return dependency.module + "@latest"; })
                                    .join(" "))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!devDependencies.length) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.exec("npm install --save-dev " +
                                dependencies
                                    .map(function (dependency) { return dependency.module + "@latest"; })
                                    .join(" "))];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        dependencies.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m.module,
                                devDependency: false,
                                version: "latest",
                                fromVersion: _this.pkgJson.dependencies[m.module],
                                type: "UPDATED"
                            });
                        });
                        devDependencies.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m.module,
                                devDependency: true,
                                version: "latest",
                                fromVersion: _this.pkgJson.devDependencies[m.module],
                                type: "UPDATED"
                            });
                        });
                        this.outdatedModules = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upgrades all deprecated dependencies to the latest version.
     */
    AutoPM.prototype.upgradeAllDeprecatedToLatest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var devDependencies, dependencies;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.deprecatedModules)
                            return [2 /*return*/];
                        devDependencies = this.deprecatedModules.filter(function (module) {
                            return _this.pkgJson.devDependencies &&
                                Object.keys(_this.pkgJson.devDependencies).includes(module.module);
                        }), dependencies = this.deprecatedModules.filter(function (module) {
                            return Object.keys(_this.pkgJson.dependencies).includes(module.module);
                        });
                        if (!(this.packageManager === "yarn")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.exec("yarn upgrade --latest " + this.deprecatedModules
                                .map(function (module) {
                                return module.module;
                            })
                                .join(" "))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!dependencies.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.exec("npm install " +
                                dependencies
                                    .map(function (dependency) { return dependency.module + "@latest"; })
                                    .join(" "))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!devDependencies.length) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.exec("npm install --save-dev " +
                                dependencies
                                    .map(function (dependency) { return dependency.module + "@latest"; })
                                    .join(" "))];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        dependencies.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m.module,
                                devDependency: false,
                                version: "latest",
                                fromVersion: _this.pkgJson.dependencies[m.module],
                                type: "UPDATED"
                            });
                        });
                        devDependencies.forEach(function (m) {
                            return _this.changedModules.push({
                                module: m.module,
                                devDependency: true,
                                version: "latest",
                                fromVersion: _this.pkgJson.devDependencies[m.module],
                                type: "UPDATED"
                            });
                        });
                        this.deprecatedModules = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    AutoPM.prototype.exec = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var process = child_process_1.exec(cmd);
                        process.on("exit", function (code) {
                            if (code === 0)
                                resolve();
                            else
                                reject(code);
                        });
                    })];
            });
        });
    };
    AutoPM.prototype.updateUnused = function () {
        var _this = this;
        this.unusedModules = Object.keys(this.pkgJson.dependencies)
            .filter(function (m) { return !_this.usedModules.includes(m); })
            .filter(function (m) {
            return !Object.values(_this.pkgJson.scripts || {}).find(function (s) {
                if (fs_1.existsSync(path_1.resolve(_this.path, "node_modules")))
                    return Object.keys(JSON.parse(fs_1.readFileSync(path_1.resolve(_this.path, "node_modules", m, "package.json"), "utf8")).bin || {}).find(function (bin) { return s.includes(bin); });
                else if (fs_1.existsSync(path_1.resolve(_this.path, "../", "node_modules")))
                    return Object.keys(JSON.parse(fs_1.readFileSync(path_1.resolve(_this.path, "../", "node_modules", m, "package.json"), "utf8")).bin || {}).find(function (bin) { return s.includes(bin); });
                else
                    return true;
            });
        })
            .filter(function (m) { return !_this.exclude.includes(m); })
            .filter(function (m) { return !m.includes("@types/"); });
    };
    AutoPM.prototype.updateOutdatedAndDeprecated = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allDeps, deprecated, outdated, _loop_1, _i, _a, _b, module_1, version;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        allDeps = this.pkgJson.devDependencies
                            ? Object.assign(this.pkgJson.dependencies, this.pkgJson.devDependencies)
                            : this.pkgJson.dependencies, deprecated = [], outdated = [];
                        _loop_1 = function (module_1, version) {
                            var installedVersion, npmVersions, vIndex, npmVersion;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        installedVersion = version.replace("^", "");
                                        return [4 /*yield*/, getModuleVersions_1.default(module_1)];
                                    case 1:
                                        npmVersions = _a.sent();
                                        //* Something went wrong while getting the versions?
                                        if (!getModuleVersions_1.instanceOfModuleVersions(npmVersions))
                                            return [2 /*return*/, "continue"];
                                        //* Version is already the same as the lastest one on NPM. (Up-to-date)
                                        // prettier-ignore
                                        if (compare_versions_1.compare(installedVersion, npmVersions.versionTags.latest, "="))
                                            return [2 /*return*/, "continue"];
                                        vIndex = npmVersions.versions.findIndex(function (v) { return v.version === installedVersion; });
                                        //* Make sure the index is found.
                                        if (vIndex < 0)
                                            return [2 /*return*/, "continue"];
                                        npmVersion = npmVersions.versions[vIndex];
                                        //* Check if current version is deprecated.
                                        if (npmVersion === null || npmVersion === void 0 ? void 0 : npmVersion.deprecated)
                                            deprecated.push({
                                                module: module_1,
                                                deprecatedMessage: npmVersion.deprecated,
                                                currentVersion: installedVersion,
                                                latestVersion: npmVersions.versionTags.latest,
                                                newerNonDeprecatedVersions: npmVersions.versions
                                                    .filter(function (v) {
                                                    if (v.deprecated)
                                                        return false;
                                                    else
                                                        return compare_versions_1.compare(installedVersion, v.version, "<");
                                                })
                                                    .map(function (v) { return v.version; })
                                                    .reverse()
                                            });
                                        else
                                            outdated.push({
                                                module: module_1,
                                                currentVersion: installedVersion,
                                                latestVersion: npmVersions.versionTags.latest,
                                                newerNonDeprecatedVersions: npmVersions.versions
                                                    .filter(function (v) {
                                                    if (v.deprecated)
                                                        return false;
                                                    else
                                                        return compare_versions_1.compare(installedVersion, v.version, "<");
                                                })
                                                    .map(function (v) { return v.version; })
                                                    .reverse()
                                            });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _a = Object.entries(allDeps);
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], module_1 = _b[0], version = _b[1];
                        return [5 /*yield**/, _loop_1(module_1, version)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.deprecatedModules = deprecated;
                        this.outdatedModules = outdated;
                        return [2 /*return*/];
                }
            });
        });
    };
    return AutoPM;
}());
exports.default = AutoPM;
//# sourceMappingURL=index.js.map