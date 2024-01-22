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
exports.showDashboard = void 0;
const vscode_1 = require("vscode");
const HttpClient_1 = require("../http/HttpClient");
const _404_1 = require("../local/404");
const Util_1 = require("../Util");
let currentPanel = undefined;
function showDashboard(params = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, Util_1.checkRegistrationForReport)(true)) {
            return;
        }
        initiatePanel('Dashboard', 'dashboard');
        if ((0, Util_1.isPrimaryWindow)()) {
            vscode_1.window.withProgress({
                location: vscode_1.ProgressLocation.Notification,
                title: 'Loading dashboard...',
                cancellable: false,
            }, () => __awaiter(this, void 0, void 0, function* () {
                loadDashboard(params);
            }));
        }
        else {
            // no need to show the loading notification for secondary windows
            loadDashboard(params);
        }
    });
}
exports.showDashboard = showDashboard;
function loadDashboard(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const html = yield getDashboardHtml(params);
        if (currentPanel) {
            currentPanel.webview.html = html;
            currentPanel.reveal(vscode_1.ViewColumn.One);
        }
    });
}
function initiatePanel(title, viewType) {
    if (currentPanel) {
        // dipose the previous one
        currentPanel.dispose();
    }
    if (!currentPanel) {
        currentPanel = vscode_1.window.createWebviewPanel(viewType, title, vscode_1.ViewColumn.One, { enableScripts: true });
        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
        });
    }
    // commandMessage can be anything; object, number, string, etc
    currentPanel.webview.onDidReceiveMessage((commandMessage) => __awaiter(this, void 0, void 0, function* () {
        //
    }));
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
function getDashboardHtml(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const qryString = new URLSearchParams(params).toString();
        const resp = yield (0, HttpClient_1.appGet)(`/plugin/dashboard?${qryString}`);
        if ((0, HttpClient_1.isResponseOk)(resp)) {
            return resp.data.html;
        }
        else {
            vscode_1.window.showErrorMessage('Unable to generate dashboard. Please try again later.');
            return yield (0, _404_1.getConnectionErrorHtml)();
        }
    });
}
//# sourceMappingURL=WebViewManager.js.map