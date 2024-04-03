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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@actions/core");
var fs_1 = require("fs");
var stream_1 = require("stream");
function getLatestVersion() {
    return __awaiter(this, void 0, void 0, function () {
        var r, t, re, arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetch('https://keepass.info/download.html')];
                case 1:
                    r = _a.sent();
                    if (!r.ok) return [3, 3];
                    return [4, r.text()];
                case 2:
                    t = _a.sent();
                    re = new RegExp(/https:\/\/sourceforge\.net\/projects\/keepass\/files\/KeePass%202\.x\/[\d.]+?\/KeePass-([\d.]+?)\.zip\/download/i);
                    arr = re.exec(t);
                    if (arr.length == 2)
                        return [2, arr[1]];
                    _a.label = 3;
                case 3: return [2, undefined];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var version, filename, url, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    version = (0, core_1.getInput)('version');
                    if (!(version === 'latest')) return [3, 2];
                    return [4, getLatestVersion()];
                case 1:
                    version = _b.sent();
                    if (version == undefined) {
                        return [2, (0, core_1.setFailed)('Unable to determine latest keepass version')];
                    }
                    _b.label = 2;
                case 2:
                    filename = "KeePass-".concat(version, ".zip");
                    url = "https://sourceforge.net/projects/keepass/files/KeePass%202.x/".concat(version, "/").concat(filename, "/download");
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4, new Promise(function (resolve) {
                            fetch(url).then(function (r) {
                                if (!r.ok) {
                                    throw new Error('download failed');
                                }
                                var file = (0, fs_1.createWriteStream)(filename, {
                                    encoding: 'binary',
                                });
                                file.on('error', function () {
                                    throw new Error();
                                });
                                file.on('finish', resolve);
                                stream_1.Readable.fromWeb(r.body).pipe(file);
                            });
                        })];
                case 4:
                    _b.sent();
                    return [3, 6];
                case 5:
                    _a = _b.sent();
                    return [2, (0, core_1.setFailed)('error downloading file')];
                case 6:
                    (0, core_1.setOutput)('filename', filename);
                    (0, core_1.setOutput)('version', version);
                    return [2];
            }
        });
    });
}
void run();
