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
exports.launchWebDashboardView = exports.showQuickPick = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../Util");
const Constants_1 = require("../Constants");
/**
 * Pass in the following array of objects
 * options: {placeholder, items: [{label, description, url, detail, tooltip},...]}
 */
function showQuickPick(pickOptions) {
    if (!pickOptions || !pickOptions['items']) {
        return;
    }
    let options = {
        matchOnDescription: false,
        matchOnDetail: false,
        placeHolder: pickOptions.placeholder || '',
    };
    return vscode_1.window.showQuickPick(pickOptions.items, options).then((item) => __awaiter(this, void 0, void 0, function* () {
        if (item) {
            const url = item['url'];
            const cb = item['cb'];
            const command = item['command'];
            const commandArgs = item['commandArgs'] || [];
            if (url) {
                (0, Util_1.launchWebUrl)(url);
            }
            else if (cb) {
                cb();
            }
            else if (command) {
                vscode_1.commands.executeCommand(command, ...commandArgs);
            }
        }
        return item;
    }));
}
exports.showQuickPick = showQuickPick;
function launchWebDashboardView() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, Util_1.launchWebUrl)(`${Constants_1.app_url}/login`);
    });
}
exports.launchWebDashboardView = launchWebDashboardView;
//# sourceMappingURL=MenuManager.js.map