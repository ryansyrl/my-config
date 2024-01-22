"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncManager = exports.passedThreshold = void 0;
const Util_1 = require("../Util");
const StatusBarManager_1 = require("./StatusBarManager");
const FlowManager_1 = require("./FlowManager");
const vscode_1 = require("vscode");
const fs = require('fs');
const thirty_seconds = 1000 * 30;
function passedThreshold(now_in_millis, synced_val) {
    if (!synced_val || now_in_millis - synced_val > thirty_seconds) {
        return true;
    }
    return false;
}
exports.passedThreshold = passedThreshold;
class SyncManager {
    static getInstance() {
        if (!SyncManager._instance) {
            SyncManager._instance = new SyncManager();
        }
        return SyncManager._instance;
    }
    constructor() {
        // make sure the flow change file exists
        (0, Util_1.getFlowChangeFile)();
        // flowChange.json watch
        fs.watch((0, Util_1.getFlowChangeFile)(), (curr, prev) => {
            const currFlowState = (0, Util_1.isFlowModeEnabled)();
            if (curr === 'change' && (0, FlowManager_1.isInFlowLocally)() !== currFlowState) {
                (0, FlowManager_1.updateInFlowLocally)(currFlowState);
                // update the status bar
                (0, StatusBarManager_1.updateFlowModeStatusBar)();
                // update the sidebar
                vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
            }
        });
    }
}
exports.SyncManager = SyncManager;
//# sourceMappingURL=SyncManger.js.map