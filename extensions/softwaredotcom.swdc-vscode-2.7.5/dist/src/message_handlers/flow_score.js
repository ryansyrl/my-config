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
exports.handleFlowScoreMessage = void 0;
const DataController_1 = require("../DataController");
const FlowManager_1 = require("../managers/FlowManager");
const Util_1 = require("../Util");
function handleFlowScoreMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if ((0, DataController_1.isRegistered)()) {
                (0, FlowManager_1.enableFlow)({ automated: true });
            }
        }
        catch (e) {
            (0, Util_1.logIt)("Error handling flow score message: " + e.message);
        }
    });
}
exports.handleFlowScoreMessage = handleFlowScoreMessage;
//# sourceMappingURL=flow_score.js.map