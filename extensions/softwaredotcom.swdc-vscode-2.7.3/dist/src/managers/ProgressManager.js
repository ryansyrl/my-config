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
exports.progressIt = exports.ProgressManager = void 0;
const vscode_1 = require("vscode");
class ProgressManager {
    constructor() {
        this.doneWriting = true;
        //
    }
    static getInstance() {
        if (!ProgressManager.instance) {
            ProgressManager.instance = new ProgressManager();
        }
        return ProgressManager.instance;
    }
    reportProgress(progress, increment) {
        if (this.doneWriting) {
            return;
        }
        if (increment < 80) {
            increment += 10;
        }
        else if (increment < 90) {
            increment += 1;
        }
        increment = Math.min(90, increment);
        setTimeout(() => {
            progress.report({ increment });
            this.reportProgress(progress, increment);
        }, 450);
    }
}
exports.ProgressManager = ProgressManager;
function progressIt(msg, asyncFunc, args = []) {
    vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Notification,
        title: msg,
        cancellable: false,
    }, (progress) => __awaiter(this, void 0, void 0, function* () {
        if (typeof asyncFunc === 'function') {
            if (args === null || args === void 0 ? void 0 : args.length) {
                yield asyncFunc(...args).catch((e) => { });
            }
            else {
                yield asyncFunc().catch((e) => { });
            }
        }
        else {
            yield asyncFunc;
        }
    }));
}
exports.progressIt = progressIt;
//# sourceMappingURL=ProgressManager.js.map