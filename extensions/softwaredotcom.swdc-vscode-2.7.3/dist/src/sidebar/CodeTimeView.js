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
exports.CodeTimeView = void 0;
const vscode_1 = require("vscode");
const HttpClient_1 = require("../http/HttpClient");
const _404_1 = require("../local/404");
const Util_1 = require("../Util");
const AccountManager_1 = require("../menu/AccountManager");
const StatusBarManager_1 = require("../managers/StatusBarManager");
class CodeTimeView {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        this._onDidClose = new vscode_1.EventEmitter();
        //
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._webview) {
                // its not available to refresh yet
                return;
            }
            this._webview.webview.html = yield this.getHtml();
        });
    }
    get onDidClose() {
        return this._onDidClose.event;
    }
    // this is called when a view first becomes visible. This may happen when the view is first loaded
    // or when the user hides and then shows a view again
    resolveWebviewView(webviewView, context, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._webview) {
                this._webview = webviewView;
            }
            this._webview.webview.options = {
                // Allow scripts in the webview
                enableScripts: true,
                enableCommandUris: true,
                localResourceRoots: [this._extensionUri],
            };
            this._disposable = vscode_1.Disposable.from(this._webview.onDidDispose(this.onWebviewDisposed, this));
            this._webview.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
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
            if (!(0, Util_1.getItem)('jwt')) {
                // the sidebar can sometimes try to render before we've created an anon user, create that first
                yield (0, AccountManager_1.createAnonymousUser)();
                setTimeout(() => {
                    vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
                }, 2000);
            }
            else {
                this._webview.webview.html = yield this.getHtml();
            }
        });
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    onWebviewDisposed() {
        this._onDidClose.fire();
    }
    get viewColumn() {
        return undefined;
    }
    get visible() {
        return this._webview ? this._webview.visible : false;
    }
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                showing_statusbar: (0, StatusBarManager_1.isStatusBarTextVisible)(),
                skip_slack_connect: !!(0, Util_1.getBooleanItem)('vscode_CtskipSlackConnect'),
            };
            const resp = yield (0, HttpClient_1.appGet)('/plugin/sidebar', params);
            if ((0, HttpClient_1.isResponseOk)(resp)) {
                return resp.data;
            }
            return yield (0, _404_1.getConnectionErrorHtml)();
        });
    }
}
exports.CodeTimeView = CodeTimeView;
//# sourceMappingURL=CodeTimeView.js.map