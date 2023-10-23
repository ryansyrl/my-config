"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeJsonData = exports.getFileDataAsJson = exports.setJsonItem = exports.getJsonItem = exports.getBooleanJsonItem = exports.setSessionStorageManager = void 0;
const Util_1 = require("../Util");
const fs = require('fs');
const path = require('path');
let storageMgr = undefined;
function setSessionStorageManager(storageManager) {
    storageMgr = storageManager;
    // convert old storage to new storage if needed
    if (!(storageMgr === null || storageMgr === void 0 ? void 0 : storageMgr.getValue('session_converion_complete'))) {
        const sessionJson = getFileDataAsJson((0, Util_1.getSoftwareSessionFile)());
        if (sessionJson) {
            for (const key in sessionJson) {
                storageMgr === null || storageMgr === void 0 ? void 0 : storageMgr.setValue(`session_${key}`, sessionJson[key]);
            }
        }
        storageManager === null || storageManager === void 0 ? void 0 : storageManager.setValue('session_converion_complete', 'true');
    }
}
exports.setSessionStorageManager = setSessionStorageManager;
function getBooleanJsonItem(file, key) {
    const value = getJsonItem(file, key);
    try {
        return !!JSON.parse(value);
    }
    catch (e) {
        return false;
    }
}
exports.getBooleanJsonItem = getBooleanJsonItem;
function getJsonItem(file, key, defaultValue = '') {
    return (storageMgr === null || storageMgr === void 0 ? void 0 : storageMgr.getValue(`${(0, Util_1.getFileNameFromPath)(file)}_${key}`)) || defaultValue;
}
exports.getJsonItem = getJsonItem;
function setJsonItem(file, key, value) {
    const new_key = `${(0, Util_1.getFileNameFromPath)(file)}_${key}`;
    storageMgr === null || storageMgr === void 0 ? void 0 : storageMgr.setValue(new_key, value);
}
exports.setJsonItem = setJsonItem;
function getFileDataAsJson(filePath) {
    var _a;
    try {
        let content = (_a = fs.readFileSync(filePath, 'utf8')) === null || _a === void 0 ? void 0 : _a.trim();
        return JSON.parse(content);
    }
    catch (e) {
        (0, Util_1.logIt)(`Unable to read ${getBaseName(filePath)} info: ${e.message}`, true);
    }
    return null;
}
exports.getFileDataAsJson = getFileDataAsJson;
/**
 * Single place to write json data (json obj or json array)
 * @param filePath
 * @param json
 */
function storeJsonData(filePath, json) {
    try {
        const content = JSON.stringify(json);
        fs.writeFileSync(filePath, content, 'utf8');
    }
    catch (e) {
        (0, Util_1.logIt)(`Unable to write ${getBaseName(filePath)} info: ${e.message}`, true);
    }
}
exports.storeJsonData = storeJsonData;
function getBaseName(filePath) {
    let baseName = filePath;
    try {
        baseName = path.basename(filePath);
    }
    catch (e) { }
    return baseName;
}
//# sourceMappingURL=FileManager.js.map