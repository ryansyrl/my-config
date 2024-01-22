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
exports.updateStatusBarWithSummaryData = exports.isStatusBarTextVisible = exports.toggleStatusBar = exports.updateFlowModeStatusBar = exports.initializeStatusBar = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("../DataController");
const Util_1 = require("../Util");
const FileManager_1 = require("./FileManager");
let showStatusBarText = true;
let ctMetricStatusBarItem = undefined;
let ctFlowModeStatusBarItem = undefined;
function initializeStatusBar() {
    return __awaiter(this, void 0, void 0, function* () {
        ctMetricStatusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 10);
        // add the name to the tooltip if we have it
        const name = (0, Util_1.getItem)('name');
        let tooltip = 'Click to see more from Code Time';
        if (name) {
            tooltip = `${tooltip} (${name})`;
        }
        ctMetricStatusBarItem.tooltip = tooltip;
        ctMetricStatusBarItem.command = 'codetime.displaySidebar';
        ctMetricStatusBarItem.show();
        ctFlowModeStatusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 9);
        yield updateFlowModeStatusBar();
    });
}
exports.initializeStatusBar = initializeStatusBar;
function updateFlowModeStatusBar() {
    return __awaiter(this, void 0, void 0, function* () {
        const prevCmd = ctFlowModeStatusBarItem ? ctFlowModeStatusBarItem.command : undefined;
        const { flowModeCommand, flowModeText, flowModeTooltip } = yield getFlowModeStatusBarInfo();
        if (ctFlowModeStatusBarItem) {
            ctFlowModeStatusBarItem.command = flowModeCommand;
            ctFlowModeStatusBarItem.text = flowModeText;
            ctFlowModeStatusBarItem.tooltip = flowModeTooltip;
            if ((0, DataController_1.isRegistered)()) {
                ctFlowModeStatusBarItem.show();
            }
            else {
                ctFlowModeStatusBarItem.hide();
            }
            if (prevCmd !== undefined && prevCmd !== flowModeCommand) {
                // refresh the sidebar
                vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
            }
        }
    });
}
exports.updateFlowModeStatusBar = updateFlowModeStatusBar;
function getFlowModeStatusBarInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        let flowModeCommand = 'codetime.enableFlowMode';
        let flowModeText = '$(circle-large-outline) Flow';
        let flowModeTooltip = 'Enter Flow Mode';
        if ((0, Util_1.isFlowModeEnabled)()) {
            flowModeCommand = 'codetime.exitFlowMode';
            flowModeText = '$(circle-large-filled) Flow';
            flowModeTooltip = 'Exit Flow Mode';
        }
        return { flowModeCommand, flowModeText, flowModeTooltip };
    });
}
function toggleStatusBar() {
    showStatusBarText = !showStatusBarText;
    // toggle the flow mode
    if (ctFlowModeStatusBarItem) {
        if (showStatusBarText && (0, DataController_1.isRegistered)()) {
            ctFlowModeStatusBarItem.show();
        }
        else if (!showStatusBarText) {
            ctFlowModeStatusBarItem.hide();
        }
    }
    // toggle the metrics value
    updateStatusBarWithSummaryData();
}
exports.toggleStatusBar = toggleStatusBar;
function isStatusBarTextVisible() {
    return showStatusBarText;
}
exports.isStatusBarTextVisible = isStatusBarTextVisible;
/**
 * Updates the status bar text with the current day minutes (session minutes)
 */
function updateStatusBarWithSummaryData() {
    // Number will convert undefined/null to 0
    let averageDailyMinutes = Number((0, FileManager_1.getJsonItem)((0, Util_1.getSessionSummaryFile)(), 'averageDailyMinutes'));
    let currentDayMinutes = Number((0, FileManager_1.getJsonItem)((0, Util_1.getSessionSummaryFile)(), 'currentDayMinutes'));
    const inFlowIcon = currentDayMinutes > averageDailyMinutes ? '$(rocket)' : '$(clock)';
    const minutesStr = (0, Util_1.humanizeMinutes)(currentDayMinutes);
    const msg = `${inFlowIcon} ${minutesStr}`;
    showStatus(msg, null);
}
exports.updateStatusBarWithSummaryData = updateStatusBarWithSummaryData;
function showStatus(msg, tooltip) {
    if (!tooltip) {
        tooltip = 'Active code time today. Click to see more from Code Time.';
    }
    const email = (0, Util_1.getItem)('name');
    let userInfo = '';
    if (email) {
        userInfo = ` Connected as ${email}`;
    }
    if (!showStatusBarText) {
        // add the message to the tooltip
        tooltip = msg + ' | ' + tooltip;
    }
    if (!ctMetricStatusBarItem) {
        return;
    }
    ctMetricStatusBarItem.tooltip = `${tooltip}${userInfo}`;
    if (!showStatusBarText) {
        ctMetricStatusBarItem.text = '$(clock)';
    }
    else {
        ctMetricStatusBarItem.text = msg;
    }
}
//# sourceMappingURL=StatusBarManager.js.map