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
exports.buildEmailSignup = exports.buildLoginUrl = exports.launchLogin = exports.launchEmailSignup = exports.lazilyPollForAuth = exports.onboardInit = exports.updatedAuthAdded = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../Util");
const HttpClient_1 = require("../http/HttpClient");
const AccountManager_1 = require("../menu/AccountManager");
const DataController_1 = require("../DataController");
const Constants_1 = require("../Constants");
const url_1 = require("url");
let retry_counter = 0;
let authAdded = false;
function updatedAuthAdded(val) {
    authAdded = val;
}
exports.updatedAuthAdded = updatedAuthAdded;
function onboardInit(ctx, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, Util_1.getItem)('jwt')) {
            // we have the jwt, call the callback that anon was not created
            return callback(ctx, false /*anonCreated*/);
        }
        if (vscode_1.window.state.focused) {
            // perform primary window related work
            primaryWindowOnboarding(ctx, callback);
        }
        else {
            // call the secondary onboarding logic
            secondaryWindowOnboarding(ctx, callback);
        }
    });
}
exports.onboardInit = onboardInit;
function primaryWindowOnboarding(ctx, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, AccountManager_1.createAnonymousUser)();
        callback(ctx, true /*anonCreated*/);
    });
}
/**
 * This is called if there's no JWT. If it reaches a
 * 6th call it will create an anon user.
 * @param ctx
 * @param callback
 */
function secondaryWindowOnboarding(ctx, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, Util_1.getItem)("jwt")) {
            return;
        }
        if (retry_counter < 5) {
            retry_counter++;
            // call activate again in about 15 seconds
            setTimeout(() => {
                onboardInit(ctx, callback);
            }, 1000 * 15);
            return;
        }
        // tried enough times, create an anon user
        yield (0, AccountManager_1.createAnonymousUser)();
        // call the callback
        return callback(ctx, true /*anonCreated*/);
    });
}
function lazilyPollForAuth(tries = 20) {
    return __awaiter(this, void 0, void 0, function* () {
        if (authAdded) {
            return;
        }
        const registered = yield getUserRegistrationInfo();
        if (!registered && tries > 0) {
            // try again
            tries--;
            setTimeout(() => {
                lazilyPollForAuth(tries);
            }, 15000);
        }
    });
}
exports.lazilyPollForAuth = lazilyPollForAuth;
function getUserRegistrationInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = (0, Util_1.getAuthCallbackState)(false) || (0, Util_1.getItem)('jwt');
        // fetch the user
        let resp = yield (0, HttpClient_1.softwareGet)('/users/plugin/state', token);
        let user = (0, HttpClient_1.isResponseOk)(resp) && resp.data ? resp.data.user : null;
        // only update if its a registered, not anon user
        if (user && user.registered === 1) {
            yield (0, DataController_1.authenticationCompleteHandler)(user);
            return true;
        }
        return false;
    });
}
function launchEmailSignup(switching_account = false) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, Util_1.setItem)('authType', 'software');
        (0, Util_1.setItem)('switching_account', switching_account);
        // continue with onboaring
        const url = yield buildEmailSignup();
        (0, Util_1.launchWebUrl)(url);
    });
}
exports.launchEmailSignup = launchEmailSignup;
function launchLogin(loginType = 'software', switching_account = false) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, Util_1.setItem)('authType', loginType);
        (0, Util_1.setItem)('switching_account', switching_account);
        // continue with onboaring
        const url = yield buildLoginUrl(loginType);
        (0, Util_1.launchWebUrl)(url);
    });
}
exports.launchLogin = launchLogin;
/**
 * @param loginType "software" | "existing" | "google" | "github"
 */
function buildLoginUrl(loginType) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = (0, Util_1.getItem)('name');
        let url = Constants_1.app_url;
        let params = getAuthQueryObject();
        // only send the plugin_token when registering for the 1st time
        if (!name) {
            params.append('plugin_token', (0, Util_1.getItem)('jwt'));
        }
        if (loginType === 'github') {
            // github signup/login flow
            url = `${Constants_1.app_url}/auth/github`;
        }
        else if (loginType === 'google') {
            // google signup/login flow
            url = `${Constants_1.app_url}/auth/google`;
        }
        else {
            // email login
            params.append('token', (0, Util_1.getItem)('jwt'));
            params.append('auth', 'software');
            url = `${Constants_1.app_url}/onboarding`;
        }
        updatedAuthAdded(false);
        setTimeout(() => {
            lazilyPollForAuth();
        }, Constants_1.TWENTY_SEC_TIMEOUT_MILLIS);
        return `${url}?${params.toString()}`;
    });
}
exports.buildLoginUrl = buildLoginUrl;
/**
 * @param loginType "software" | "existing" | "google" | "github"
 */
function buildEmailSignup() {
    return __awaiter(this, void 0, void 0, function* () {
        let loginUrl = Constants_1.app_url;
        let params = getAuthQueryObject();
        params.append('auth', 'software');
        params.append('token', (0, Util_1.getItem)('jwt'));
        loginUrl = `${Constants_1.app_url}/email-signup`;
        updatedAuthAdded(false);
        setTimeout(() => {
            lazilyPollForAuth();
        }, Constants_1.TWENTY_SEC_TIMEOUT_MILLIS);
        return `${loginUrl}?${params.toString()}`;
    });
}
exports.buildEmailSignup = buildEmailSignup;
function getAuthQueryObject() {
    const params = new url_1.URLSearchParams();
    params.append('plugin_uuid', (0, Util_1.getPluginUuid)());
    params.append('plugin_id', `${(0, Util_1.getPluginId)()}`);
    params.append('plugin_version', (0, Util_1.getVersion)());
    params.append('auth_callback_state', (0, Util_1.getAuthCallbackState)(true));
    return params;
}
//# sourceMappingURL=OnboardManager.js.map