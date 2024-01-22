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
exports.getCachedIntegrations = exports.userDeletedCompletionHandler = exports.authenticationCompleteHandler = exports.getUser = exports.getUserPreferences = exports.isRegistered = exports.getCachedUser = exports.getCachedSlackIntegrations = void 0;
const vscode_1 = require("vscode");
const HttpClient_1 = require("./http/HttpClient");
const Util_1 = require("./Util");
const websockets_1 = require("./websockets");
const SummaryManager_1 = require("./managers/SummaryManager");
const FlowManager_1 = require("./managers/FlowManager");
const AccountManager_1 = require("./menu/AccountManager");
const ExtensionManager_1 = require("./managers/ExtensionManager");
let currentUser = null;
let lastUserFetch = 0;
function getCachedSlackIntegrations() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentUser) {
            currentUser = yield getUser();
        }
        if ((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.integration_connections) === null || _a === void 0 ? void 0 : _a.length) {
            return (_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.integration_connections) === null || _b === void 0 ? void 0 : _b.filter((integration) => integration.status === 'ACTIVE' && (integration.integration_type_id === 14));
        }
        return [];
    });
}
exports.getCachedSlackIntegrations = getCachedSlackIntegrations;
function getCachedUser() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentUser) {
            currentUser = yield getUser();
        }
        return currentUser;
    });
}
exports.getCachedUser = getCachedUser;
function isRegistered() {
    return !!(0, Util_1.getItem)('name');
}
exports.isRegistered = isRegistered;
function getUserPreferences() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentUser) {
            currentUser = yield getUser();
        }
        if (currentUser) {
            let prefs = currentUser.preferences;
            if (prefs && typeof prefs === 'string') {
                try {
                    return JSON.parse(prefs);
                }
                catch (e) {
                    (0, Util_1.logIt)(`Error parsing preferences: ${e.message}`, true);
                }
            }
        }
        return {};
    });
}
exports.getUserPreferences = getUserPreferences;
function getUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const nowMillis = new Date().getTime();
        if (currentUser && nowMillis - lastUserFetch < 2000) {
            return currentUser;
        }
        const resp = yield (0, HttpClient_1.appGet)('/api/v1/user');
        if ((0, HttpClient_1.isResponseOk)(resp) && resp.data) {
            currentUser = resp.data;
            if (hasIntegrationConnection(8, currentUser === null || currentUser === void 0 ? void 0 : currentUser.integration_connections)) {
                (0, Util_1.setItem)('authType', 'google');
            }
            else if (hasIntegrationConnection(9, currentUser === null || currentUser === void 0 ? void 0 : currentUser.integration_connections)) {
                (0, Util_1.setItem)('authType', 'github');
            }
            else {
                (0, Util_1.setItem)('authType', 'software');
            }
            lastUserFetch = nowMillis;
            return currentUser;
        }
        return null;
    });
}
exports.getUser = getUser;
function hasIntegrationConnection(type_id, connections = []) {
    return !!(connections === null || connections === void 0 ? void 0 : connections.find((integration) => integration.status === 'ACTIVE' && (integration.integration_type_id === type_id)));
}
function authenticationCompleteHandler(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let updatedUserInfo = false;
        // clear the auth callback state
        (0, Util_1.setItem)('switching_account', false);
        (0, Util_1.setAuthCallbackState)(null);
        if ((user === null || user === void 0 ? void 0 : user.registered) === 1) {
            currentUser = user;
            updatedUserInfo = true;
            // new user
            if (user.plugin_jwt) {
                (0, Util_1.setItem)('jwt', user.plugin_jwt);
            }
            (0, Util_1.setItem)('name', user.email);
            const currentAuthType = (0, Util_1.getItem)('authType');
            if (!currentAuthType) {
                (0, Util_1.setItem)('authType', 'software');
            }
            // update the login status
            vscode_1.window.showInformationMessage(`Successfully logged on to Code Time`);
            (0, FlowManager_1.updateFlowModeStatus)();
            try {
                (0, websockets_1.initializeWebsockets)();
            }
            catch (e) {
                (0, Util_1.logIt)(`Failed to initialize websockets: ${e.message}`);
            }
            // re-initialize user and preferences
            yield getUser();
            // fetch after logging on
            SummaryManager_1.SummaryManager.getInstance().updateSessionSummaryFromServer();
        }
        if ((0, Util_1.musicTimeExtInstalled)()) {
            setTimeout(() => {
                vscode_1.commands.executeCommand("musictime.refreshMusicTimeView");
            }, 1000);
        }
        if ((0, Util_1.editorOpsExtInstalled)()) {
            setTimeout(() => {
                vscode_1.commands.executeCommand("editorOps.refreshEditorOpsView");
            }, 1000);
        }
        // update the extensions if its a new user
        setTimeout(() => {
            ExtensionManager_1.ExtensionManager.getInstance().initialize();
        }, 1000);
        vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
        (0, Util_1.logIt)('Successfully logged on to Code Time');
        return updatedUserInfo;
    });
}
exports.authenticationCompleteHandler = authenticationCompleteHandler;
function userDeletedCompletionHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser();
        if (!(user === null || user === void 0 ? void 0 : user.registered)) {
            // reset the user session
            (0, AccountManager_1.createAnonymousUser)();
            // update the login status
            vscode_1.window.showInformationMessage(`Successfully deleted your Code Time account`);
            try {
                (0, websockets_1.initializeWebsockets)();
            }
            catch (e) {
                (0, Util_1.logIt)(`Failed to initialize websockets: ${e.message}`);
            }
            // re-initialize user and preferences
            yield getUser();
            // fetch after logging on
            SummaryManager_1.SummaryManager.getInstance().updateSessionSummaryFromServer();
            if ((0, Util_1.musicTimeExtInstalled)()) {
                setTimeout(() => {
                    vscode_1.commands.executeCommand("musictime.refreshMusicTimeView");
                }, 1000);
            }
            if ((0, Util_1.editorOpsExtInstalled)()) {
                setTimeout(() => {
                    vscode_1.commands.executeCommand("editorOps.refreshEditorOpsView");
                }, 1000);
            }
            vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
            (0, Util_1.logIt)('Successfully deleted your Code Time account');
        }
    });
}
exports.userDeletedCompletionHandler = userDeletedCompletionHandler;
function getCachedIntegrations(integration_type_id = undefined) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser();
        if ((_a = user === null || user === void 0 ? void 0 : user.integration_connections) === null || _a === void 0 ? void 0 : _a.length) {
            if (integration_type_id) {
                return user.integration_connections.filter((integration) => integration.status === 'ACTIVE' && integration_type_id === integration.integration_type_id);
            }
            else {
                return user.integration_connections;
            }
        }
        return [];
    });
}
exports.getCachedIntegrations = getCachedIntegrations;
//# sourceMappingURL=DataController.js.map