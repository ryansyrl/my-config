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
exports.isResponseOk = exports.hasTokenExpired = exports.softwareGet = exports.appDelete = exports.appPost = exports.appPut = exports.appGet = void 0;
const axios = require('axios');
const vscode_1 = require("vscode");
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
// build the axios api base url
const beApi = axios.create({
    baseURL: `${Constants_1.api_endpoint}`,
    timeout: Constants_1.TWENTY_SEC_TIMEOUT_MILLIS,
});
const appApi = axios.create({
    baseURL: `${Constants_1.app_url}`,
    timeout: 15000,
});
const headers = {
    'X-SWDC-Plugin-Id': (0, Util_1.getPluginId)(),
    'X-SWDC-Plugin-Name': (0, Util_1.getPluginName)(),
    'X-SWDC-Plugin-Version': (0, Util_1.getVersion)(),
    'X-SWDC-Plugin-OS': (0, Util_1.getOs)(),
    'X-SWDC-Plugin-TZ': Intl.DateTimeFormat().resolvedOptions().timeZone,
    'X-SWDC-Plugin-Offset': (0, Util_1.getOffsetSeconds)() / 60,
    'X-SWDC-Plugin-UUID': (0, Util_1.getPluginUuid)(),
    'X-SWDC-Plugin-Type': 'codetime',
    'X-SWDC-Plugin-Editor': 'vscode',
    'X-SWDC-Plugin-Editor-Version': vscode_1.version
};
beApi.defaults.headers.common = Object.assign(Object.assign({}, beApi.defaults.headers.common), headers);
appApi.defaults.headers.common = Object.assign(Object.assign({}, appApi.defaults.headers.common), headers);
function appGet(api, queryParams = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        updateOutgoingHeader();
        return yield appApi.get(api, { params: queryParams }).catch((err) => {
            (0, Util_1.logIt)(`error for GET ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.appGet = appGet;
function appPut(api, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        updateOutgoingHeader();
        return yield appApi.put(api, payload).catch((err) => {
            (0, Util_1.logIt)(`error for PUT ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.appPut = appPut;
function appPost(api, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        updateOutgoingHeader();
        return yield appApi.post(api, payload).catch((err) => {
            (0, Util_1.logIt)(`error for POST ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.appPost = appPost;
function appDelete(api, payload = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        updateOutgoingHeader();
        return yield appApi.delete(api, payload).catch((err) => {
            (0, Util_1.logIt)(`error for DELETE ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.appDelete = appDelete;
/**
 * Response returns a paylod with the following...
 * data: <payload>, status: 200, statusText: "OK", config: Object
 * @param api
 * @param jwt
 */
function softwareGet(api, override_token = null) {
    return __awaiter(this, void 0, void 0, function* () {
        updateOutgoingHeader(override_token);
        return yield beApi.get(api).catch((err) => {
            (0, Util_1.logIt)(`error fetching data for ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.softwareGet = softwareGet;
/**
 * Check if the spotify response has an expired token
 * {"error": {"status": 401, "message": "The access token expired"}}
 */
function hasTokenExpired(resp) {
    // when a token expires, we'll get the following error data
    // err.response.status === 401
    // err.response.statusText = "Unauthorized"
    if (resp && resp.response && resp.response.status && resp.response.status === 401) {
        return true;
    }
    return false;
}
exports.hasTokenExpired = hasTokenExpired;
/**
 * check if the reponse is ok or not
 * axios always sends the following
 * status:200
 * statusText:"OK"
 *
    code:"ENOTFOUND"
    config:Object {adapter: , transformRequest: Object, transformResponse: Object, …}
    errno:"ENOTFOUND"
    host:"api.spotify.com"
    hostname:"api.spotify.com"
    message:"getaddrinfo ENOTFOUND api.spotify.com api.spotify.com:443"
    port:443
 */
function isResponseOk(resp) {
    let status = getResponseStatus(resp);
    if (status && resp && status < 300) {
        return true;
    }
    return false;
}
exports.isResponseOk = isResponseOk;
function updateOutgoingHeader(override_token = null) {
    const token = getAuthorization();
    if (token || override_token) {
        if (override_token) {
            appApi.defaults.headers.common['Authorization'] = override_token;
            beApi.defaults.headers.common['Authorization'] = override_token;
        }
        else {
            appApi.defaults.headers.common['Authorization'] = token;
            beApi.defaults.headers.common['Authorization'] = token;
        }
    }
    appApi.defaults.headers.common['X-SWDC-Is-Light-Mode'] = !!(vscode_1.window.activeColorTheme.kind === 1);
    beApi.defaults.headers.common['X-SWDC-Is-Light-Mode'] = !!(vscode_1.window.activeColorTheme.kind === 1);
}
function getResponseStatus(resp) {
    let status = null;
    if (resp === null || resp === void 0 ? void 0 : resp.status) {
        status = resp.status;
    }
    else if ((resp === null || resp === void 0 ? void 0 : resp.response) && resp.response.status) {
        status = resp.response.status;
    }
    else if ((resp === null || resp === void 0 ? void 0 : resp.code) === 'ECONNABORTED') {
        status = 500;
    }
    else if ((resp === null || resp === void 0 ? void 0 : resp.code) === 'ECONNREFUSED') {
        status = 503;
    }
    return status;
}
function getAuthorization() {
    let token = (0, Util_1.getItem)('jwt');
    if (token === null || token === void 0 ? void 0 : token.includes('JWT ')) {
        token = `Bearer ${token.substring('JWT '.length)}`;
    }
    return token;
}
//# sourceMappingURL=HttpClient.js.map