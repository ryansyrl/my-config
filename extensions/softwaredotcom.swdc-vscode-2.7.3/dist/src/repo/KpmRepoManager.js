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
exports.getResourceInfo = void 0;
const Util_1 = require("../Util");
const CacheManager_1 = require("../cache/CacheManager");
const ExecManager_1 = require("../managers/ExecManager");
const cacheMgr = CacheManager_1.CacheManager.getInstance();
const cacheTimeoutSeconds = 60 * 15;
//
// use "git symbolic-ref --short HEAD" to get the git branch
// use "git config --get remote.origin.url" to get the remote url
function getResourceInfo(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !(0, Util_1.isGitProject)(projectDir)) {
            return null;
        }
        const noSpacesProjDir = projectDir.replace(/^\s+/g, '');
        const cacheId = `resource-info-${noSpacesProjDir}`;
        let resourceInfo = cacheMgr.get(cacheId);
        // return from cache if we have it
        if (resourceInfo) {
            return resourceInfo;
        }
        resourceInfo = {};
        const branch = (0, ExecManager_1.execCmd)('git symbolic-ref --short HEAD', projectDir);
        const identifier = (0, ExecManager_1.execCmd)('git config --get remote.origin.url', projectDir);
        let email = (0, ExecManager_1.execCmd)('git config user.email', projectDir);
        const tag = (0, ExecManager_1.execCmd)('git describe --all', projectDir);
        // both should be valid to return the resource info
        if (branch && identifier) {
            resourceInfo = { branch, identifier, email, tag };
            cacheMgr.set(cacheId, resourceInfo, cacheTimeoutSeconds);
        }
        return resourceInfo;
    });
}
exports.getResourceInfo = getResourceInfo;
//# sourceMappingURL=KpmRepoManager.js.map