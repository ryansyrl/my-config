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
exports.createAnonymousUser = exports.showSignUpAccountMenu = exports.showExistingAccountMenu = exports.showSwitchAccountsMenu = void 0;
const Util_1 = require("../Util");
const HttpClient_1 = require("../http/HttpClient");
const MenuManager_1 = require("./MenuManager");
const Constants_1 = require("../Constants");
let switching_account = false;
let creating_anon = false;
const switchAccountItem = {
    label: 'Switch to a different account?',
    detail: 'Click to link to a different account.',
};
function showSwitchAccountsMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        switching_account = true;
        accountMenuSelection(switchAccountItem);
    });
}
exports.showSwitchAccountsMenu = showSwitchAccountsMenu;
function showExistingAccountMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        switching_account = true;
        showLogInMenuOptions();
    });
}
exports.showExistingAccountMenu = showExistingAccountMenu;
function showSignUpAccountMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        switching_account = false;
        showSignUpMenuOptions();
    });
}
exports.showSignUpAccountMenu = showSignUpAccountMenu;
function accountMenuSelection(placeholderItem) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = [];
        let placeholder = '';
        const name = (0, Util_1.getItem)('name');
        if (name) {
            const authType = (0, Util_1.getItem)('authType');
            let type = 'email';
            if (authType === 'google') {
                type = 'Google';
            }
            else if (authType === 'github') {
                type = 'GitHub';
            }
            placeholder = `Connected using ${type} (${name})`;
        }
        else {
            placeholder = 'Connect using one of the following';
        }
        if (placeholderItem) {
            items.push(placeholderItem);
        }
        const menuOptions = {
            items,
            placeholder,
        };
        const selection = yield (0, MenuManager_1.showQuickPick)(menuOptions);
        if (selection) {
            // show the google, github, email menu options
            showLogInMenuOptions();
        }
    });
}
function showLogInMenuOptions() {
    showAuthMenuOptions(Constants_1.LOGIN_LABEL, false /*isSignup*/);
}
function showSignUpMenuOptions() {
    showAuthMenuOptions(Constants_1.SIGN_UP_LABEL, true /*isSignup*/);
}
function showAuthMenuOptions(authText, isSignup = true) {
    const items = [];
    const placeholder = `${authText} using...`;
    items.push({
        label: `${authText} with Google`,
        command: 'codetime.googleLogin',
        commandArgs: [null /*KpmItem*/, switching_account],
    });
    items.push({
        label: `${authText} with GitHub`,
        command: 'codetime.githubLogin',
        commandArgs: [null /*KpmItem*/, switching_account],
    });
    if (isSignup) {
        items.push({
            label: `${authText} with Email`,
            command: 'codetime.codeTimeSignup',
            commandArgs: [null /*KpmItem*/, false /*switching_account*/],
        });
    }
    else {
        items.push({
            label: `${authText} with Email`,
            command: 'codetime.codeTimeLogin',
            commandArgs: [null /*KpmItem*/, switching_account],
        });
    }
    const menuOptions = {
        items,
        placeholder,
    };
    (0, MenuManager_1.showQuickPick)(menuOptions);
}
/**
 * create an anonymous user based on github email or mac addr
 */
function createAnonymousUser() {
    return __awaiter(this, void 0, void 0, function* () {
        if (creating_anon) {
            return;
        }
        const jwt = (0, Util_1.getItem)('jwt');
        // check one more time before creating the anon user
        if (!jwt) {
            creating_anon = true;
            // this should not be undefined if its an account reset
            let plugin_uuid = (0, Util_1.getPluginUuid)();
            let auth_callback_state = (0, Util_1.getAuthCallbackState)();
            const username = (0, Util_1.getOsUsername)();
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const hostname = (0, Util_1.getHostname)();
            const resp = yield (0, HttpClient_1.appPost)('/api/v1/anonymous_user', {
                timezone,
                username,
                plugin_uuid,
                hostname,
                auth_callback_state,
            });
            if ((0, HttpClient_1.isResponseOk)(resp) && resp.data) {
                (0, Util_1.setItem)('jwt', resp.data.plugin_jwt);
                if (!resp.data.registered) {
                    (0, Util_1.setItem)('name', null);
                }
                (0, Util_1.setItem)('switching_account', false);
                (0, Util_1.setAuthCallbackState)('');
            }
        }
        creating_anon = false;
    });
}
exports.createAnonymousUser = createAnonymousUser;
//# sourceMappingURL=AccountManager.js.map