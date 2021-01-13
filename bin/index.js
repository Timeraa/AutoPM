#!/usr/bin/env node
"use strict";
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
/**
 * Auto Package Manager
 */
var AutoPM = /** @class */ (function () {
    /**
     * Create a new Auto Package Manager instance.
     * @param path Path to a project containing a package.json in it's root directory.
     * @param exclude Modules to exlcude from unusedModules.
     */
    function AutoPM(_a) {
        var _b = _a.path, path = _b === void 0 ? process.cwd() : _b, _c = _a.exclude, exclude = _c === void 0 ? [] : _c;
        this.packageManager = "npm";
        this.usedModules = [];
        this.unusedModules = [];
        this.path = path;
        this.exclude = exclude;
        this.pkgJson = require(path_1.resolve(path, "package.json"));
        if (fs_1.existsSync(path_1.resolve(this.path, "yarn.lock")))
            this.packageManager = "yarn";
        this.recheck();
    }
    /**
     * Re-checks module usage.
     */
    AutoPM.prototype.recheck = function () {
        this.usedModules = getUsedModules_1.default(this.path);
        this.unusedModules = this.updateUnused();
    };
    Object.defineProperty(AutoPM.prototype, "missingModules", {
        get: function () {
            var _this = this;
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
     */
    AutoPM.prototype.installMissing = function () {
        return __awaiter(this, void 0, void 0, function () {
            var missing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        missing = this.missingModules;
                        if (!missing)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.exec((this.packageManager === "yarn" ? "yarn add" : "npm install") + " " + missing.join(" "))];
                    case 1:
                        _a.sent();
                        this.usedModules.concat(missing);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Uninstalls unused dependencies.
     */
    AutoPM.prototype.uninstallUnused = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.unusedModules)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.exec(this.packageManager + " remove " + this.unusedModules.join(" "))];
                    case 1:
                        _a.sent();
                        this.unusedModules = [];
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
        return Object.keys(this.pkgJson.dependencies)
            .filter(function (m) { return !_this.usedModules.includes(m); })
            .filter(function (m) {
            return !Object.values(_this.pkgJson.scripts || {}).find(function (s) {
                return Object.keys(JSON.parse(fs_1.readFileSync(path_1.resolve(_this.path, "node_modules", m, "package.json"), "utf8")).bin || {}).find(function (bin) { return s.includes(bin); });
            });
        })
            .filter(function (m) { return !_this.exclude.includes(m); });
    };
    return AutoPM;
}());
exports.default = AutoPM;
//# sourceMappingURL=index.js.map