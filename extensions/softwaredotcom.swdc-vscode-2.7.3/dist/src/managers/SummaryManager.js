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
exports.SummaryManager = void 0;
const StatusBarManager_1 = require("./StatusBarManager");
const HttpClient_1 = require("../http/HttpClient");
const Util_1 = require("../Util");
const FileManager_1 = require("./FileManager");
class SummaryManager {
    constructor() {
        //
    }
    static getInstance() {
        if (!SummaryManager.instance) {
            SummaryManager.instance = new SummaryManager();
        }
        return SummaryManager.instance;
    }
    /**
     * This is only called from the new day checker
     */
    updateSessionSummaryFromServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, HttpClient_1.appGet)('/api/v1/user/session_summary');
            if ((0, HttpClient_1.isResponseOk)(result) && result.data) {
                this.updateCurrentDayStats(result.data);
            }
        });
    }
    updateCurrentDayStats(summary) {
        if (summary) {
            Object.keys(summary).forEach((key) => {
                (0, FileManager_1.setJsonItem)((0, Util_1.getSessionSummaryFile)(), key, summary[key]);
            });
        }
        (0, StatusBarManager_1.updateStatusBarWithSummaryData)();
    }
}
exports.SummaryManager = SummaryManager;
//# sourceMappingURL=SummaryManager.js.map