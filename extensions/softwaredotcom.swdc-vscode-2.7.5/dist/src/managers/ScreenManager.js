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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInFullScreenMode = exports.isInZenMode = exports.showNormalScreenMode = exports.showFullScreenMode = exports.showZenMode = exports.getConfiguredScreenMode = exports.FULL_SCREEN_MODE_ID = exports.ZEN_MODE_ID = exports.NORMAL_SCREEN_MODE = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("../DataController");
exports.NORMAL_SCREEN_MODE = 0;
exports.ZEN_MODE_ID = 1;
exports.FULL_SCREEN_MODE_ID = 2;
let preferredScreenMode = 0;
let currentModeId = 0;
function getConfiguredScreenMode() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const preferences = yield (0, DataController_1.getUserPreferences)();
        const flowModeSettings = (preferences === null || preferences === void 0 ? void 0 : preferences.flowMode) || {};
        const screenMode = (_b = (_a = flowModeSettings === null || flowModeSettings === void 0 ? void 0 : flowModeSettings.editor) === null || _a === void 0 ? void 0 : _a.vscode) === null || _b === void 0 ? void 0 : _b.screenMode;
        if (screenMode === null || screenMode === void 0 ? void 0 : screenMode.includes("Full Screen")) {
            preferredScreenMode = exports.FULL_SCREEN_MODE_ID;
        }
        else if (screenMode === null || screenMode === void 0 ? void 0 : screenMode.includes("Zen")) {
            preferredScreenMode = exports.ZEN_MODE_ID;
        }
        else {
            preferredScreenMode = exports.NORMAL_SCREEN_MODE;
        }
        return preferredScreenMode;
    });
}
exports.getConfiguredScreenMode = getConfiguredScreenMode;
function showZenMode() {
    if (currentModeId !== exports.ZEN_MODE_ID) {
        currentModeId = exports.ZEN_MODE_ID;
        vscode_1.commands.executeCommand("workbench.action.toggleZenMode");
    }
}
exports.showZenMode = showZenMode;
function showFullScreenMode() {
    if (currentModeId !== exports.FULL_SCREEN_MODE_ID) {
        vscode_1.commands.executeCommand("workbench.action.toggleFullScreen");
        currentModeId = exports.FULL_SCREEN_MODE_ID;
    }
}
exports.showFullScreenMode = showFullScreenMode;
function showNormalScreenMode() {
    if (currentModeId !== exports.NORMAL_SCREEN_MODE) {
        if (currentModeId === exports.FULL_SCREEN_MODE_ID) {
            currentModeId = exports.NORMAL_SCREEN_MODE;
            vscode_1.commands.executeCommand("workbench.action.toggleFullScreen");
        }
        else if (currentModeId === exports.ZEN_MODE_ID) {
            currentModeId = exports.NORMAL_SCREEN_MODE;
            vscode_1.commands.executeCommand("workbench.action.toggleZenMode");
        }
    }
}
exports.showNormalScreenMode = showNormalScreenMode;
function isInZenMode() {
    return !!(currentModeId === exports.ZEN_MODE_ID);
}
exports.isInZenMode = isInZenMode;
function isInFullScreenMode() {
    return !!(currentModeId === exports.FULL_SCREEN_MODE_ID);
}
exports.isInFullScreenMode = isInFullScreenMode;
//# sourceMappingURL=ScreenManager.js.map