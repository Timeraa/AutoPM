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
var fast_glob_1 = require("fast-glob");
var fs_1 = require("fs");
var path_1 = require("path");
//@ts-ignore
var require_package_name_1 = __importDefault(require("require-package-name"));
var constants_1 = require("../constants");
var getModuleVersions_1 = __importStar(require("./getModuleVersions"));
function default_1(path) {
    var _a, _b;
    if (path === void 0) { path = process.cwd(); }
    return __awaiter(this, void 0, void 0, function () {
        var files, requiredModules, _i, files_1, file, contents, imports, requires, modules, _c, modules_1, match, usedArry, unknownArray;
        var _this = this;
        return __generator(this, function (_d) {
            files = fast_glob_1.sync("**", {
                onlyFiles: true,
                ignore: ["node_modules"],
                cwd: path
            });
            requiredModules = new Set();
            for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                file = files_1[_i];
                contents = fs_1.readFileSync(path_1.resolve(path, file), "utf8"), imports = contents.match(constants_1.IMPORTREGEX) || [], requires = contents.match(constants_1.REQUIREREGEX) || [], modules = imports.concat(requires);
                for (_c = 0, modules_1 = modules; _c < modules_1.length; _c++) {
                    match = modules_1[_c];
                    requiredModules.add(require_package_name_1.default((_b = (_a = new RegExp("([\"'`])(?<moduleName>" + constants_1.MODULENAMEREGEX + ")\\1").exec(match)) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b.moduleName));
                }
            }
            usedArry = Array.from(requiredModules.keys()), unknownArray = [];
            usedArry.filter(function (module) { return __awaiter(_this, void 0, void 0, function () {
                var versions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getModuleVersions_1.default(module)];
                        case 1:
                            versions = _a.sent();
                            //* Make sure module has versions / is a valid module
                            if (!getModuleVersions_1.instanceOfModuleVersions(versions)) {
                                unknownArray.push(module);
                                return [2 /*return*/, false];
                            }
                            else {
                                return [2 /*return*/, true];
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/, { usedModules: usedArry, unknownModules: unknownArray }];
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=getUsedModules.js.map