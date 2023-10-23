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
exports.handleFlowStateMessage = void 0;
const FlowManager_1 = require("../managers/FlowManager");
function handleFlowStateMessage(body) {
    return __awaiter(this, void 0, void 0, function* () {
        // body contains {enable_flow: true | false}
        const { enable_flow } = body;
        // exit flow mode if we get "enable_flow = false"
        if (!enable_flow) {
            // disable it
            (0, FlowManager_1.pauseFlowInitiate)();
        }
    });
}
exports.handleFlowStateMessage = handleFlowStateMessage;
//# sourceMappingURL=flow_state.js.map