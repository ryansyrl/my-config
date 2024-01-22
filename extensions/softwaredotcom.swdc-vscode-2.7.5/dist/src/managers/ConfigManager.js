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
exports.updateSettings = exports.getEditSettingsHtml = exports.configureSettings = exports.closeSettings = exports.showingConfigureSettingsPanel = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("../DataController");
const HttpClient_1 = require("../http/HttpClient");
const _404_1 = require("../local/404");
const endOfDay_1 = require("../notifications/endOfDay");
let currentPanel = undefined;
function showingConfigureSettingsPanel() {
    return !!currentPanel;
}
exports.showingConfigureSettingsPanel = showingConfigureSettingsPanel;
function closeSettings() {
    if (currentPanel) {
        // dispose the previous one. always use the same tab
        currentPanel.dispose();
    }
}
exports.closeSettings = closeSettings;
function configureSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentPanel) {
            // dispose the previous one. always use the same tab
            currentPanel.dispose();
        }
        if (!currentPanel) {
            currentPanel = vscode_1.window.createWebviewPanel('edit_settings', 'Code Time Settings', vscode_1.ViewColumn.One, {
                enableScripts: true,
            });
            currentPanel.onDidDispose(() => {
                currentPanel = undefined;
            });
            currentPanel.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
                if (message === null || message === void 0 ? void 0 : message.action) {
                    const cmd = message.action.includes('codetime.') ? message.action : `codetime.${message.action}`;
                    switch (message.command) {
                        case 'command_execute':
                            if (message.payload && Object.keys(message.payload).length) {
                                vscode_1.commands.executeCommand(cmd, message.payload);
                            }
                            else {
                                vscode_1.commands.executeCommand(cmd);
                            }
                            break;
                    }
                }
            }));
        }
        currentPanel.webview.html = yield getEditSettingsHtml();
        currentPanel.reveal(vscode_1.ViewColumn.One);
    });
}
exports.configureSettings = configureSettings;
function getEditSettingsHtml() {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield (0, HttpClient_1.appGet)(`/plugin/settings`, { editor: 'vscode' });
        if ((0, HttpClient_1.isResponseOk)(resp)) {
            return resp.data.html;
        }
        return yield (0, _404_1.getConnectionErrorHtml)();
    });
}
exports.getEditSettingsHtml = getEditSettingsHtml;
function updateSettings(path, jsonData, reloadSettings) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, HttpClient_1.appPut)(path, jsonData);
        yield (0, DataController_1.getUser)();
        // update the end of the day notification trigger
        (0, endOfDay_1.setEndOfDayNotification)();
        // update the sidebar
        vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
        if (reloadSettings && currentPanel) {
            configureSettings();
        }
    });
}
exports.updateSettings = updateSettings;
//# sourceMappingURL=ConfigManager.js.map