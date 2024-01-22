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
exports.checkSlackConnectionForFlowMode = exports.checkSlackConnection = exports.showModalSignupPrompt = exports.hasSlackWorkspaces = exports.getSlackWorkspaces = void 0;
const vscode_1 = require("vscode");
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const MenuManager_1 = require("../menu/MenuManager");
const DataController_1 = require("../DataController");
// -------------------------------------------
// - public methods
// -------------------------------------------
// get saved slack integrations
function getSlackWorkspaces() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield (0, DataController_1.getCachedSlackIntegrations)()).filter((n) => (0, Util_1.isActiveIntegration)('slack', n));
    });
}
exports.getSlackWorkspaces = getSlackWorkspaces;
function hasSlackWorkspaces() {
    return __awaiter(this, void 0, void 0, function* () {
        return !!(yield (0, DataController_1.getCachedSlackIntegrations)()).length;
    });
}
exports.hasSlackWorkspaces = hasSlackWorkspaces;
// -------------------------------------------
// - private methods
// -------------------------------------------
function showSlackWorkspaceSelection() {
    return __awaiter(this, void 0, void 0, function* () {
        let menuOptions = {
            items: [],
            placeholder: `Select a Slack workspace`,
        };
        (yield getSlackWorkspaces()).forEach((integration) => {
            menuOptions.items.push({
                label: integration.team_domain,
                value: integration.team_domain,
            });
        });
        menuOptions.items.push({
            label: 'Connect a Slack workspace',
            command: 'musictime.connectSlack',
        });
        const pick = yield (0, MenuManager_1.showQuickPick)(menuOptions);
        if (pick) {
            if (pick.value) {
                return pick.value;
            }
            else if (pick.command) {
                vscode_1.commands.executeCommand(pick.command);
                return null;
            }
        }
        return null;
    });
}
/**
 * Remove an integration from the local copy
 * @param auth_id
 */
function removeSlackIntegration(auth_id) {
    (0, DataController_1.getUser)();
}
function showModalSignupPrompt(msg) {
    vscode_1.window
        .showInformationMessage(msg, {
        modal: true,
    }, Constants_1.SIGN_UP_LABEL)
        .then((selection) => __awaiter(this, void 0, void 0, function* () {
        if (selection === Constants_1.SIGN_UP_LABEL) {
            vscode_1.commands.executeCommand('codetime.registerAccount');
        }
    }));
}
exports.showModalSignupPrompt = showModalSignupPrompt;
function checkSlackConnection(showConnect = true) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield hasSlackWorkspaces())) {
            if (showConnect) {
                vscode_1.window
                    .showInformationMessage('Connect a Slack workspace to continue.', {
                    modal: true,
                }, 'Connect')
                    .then((selection) => __awaiter(this, void 0, void 0, function* () {
                    if (selection === 'Connect') {
                        vscode_1.commands.executeCommand('codetime.connectSlackWorkspace');
                    }
                }));
            }
            return false;
        }
        return true;
    });
}
exports.checkSlackConnection = checkSlackConnection;
function checkSlackConnectionForFlowMode() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield hasSlackWorkspaces())) {
            const selection = yield vscode_1.window.showInformationMessage("Slack isn't connected", { modal: true }, ...['Continue anyway', 'Connect Slack']);
            if (!selection) {
                // the user selected "cancel"
                return { continue: false, useSlackSettings: true };
            }
            else if (selection === 'Continue anyway') {
                // slack is not connected, but continue. set useSlackSettings to FALSE
                // set continue to TRUE
                (0, Util_1.setItem)('vscode_CtskipSlackConnect', true);
                return { continue: true, useSlackSettings: false };
            }
            else {
                // connect was selected
                vscode_1.commands.executeCommand('codetime.manageSlackConnection');
                return { continue: false, useSlackSettings: true };
            }
        }
        return { continue: true, useSlackSettings: true };
    });
}
exports.checkSlackConnectionForFlowMode = checkSlackConnectionForFlowMode;
//# sourceMappingURL=SlackManager.js.map