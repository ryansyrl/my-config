"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageManager = void 0;
class LocalStorageManager {
    constructor(ctx) {
        this.storage = ctx.globalState;
    }
    static getInstance(ctx) {
        if (!LocalStorageManager.instance) {
            LocalStorageManager.instance = new LocalStorageManager(ctx);
        }
        return LocalStorageManager.instance;
    }
    getValue(key) {
        return this.storage.get(key, '');
    }
    setValue(key, value) {
        this.storage.update(key, value);
    }
    deleteValue(key) {
        this.storage.update(key, undefined);
    }
    clearDupStorageKeys() {
        const keys = this.storage.keys();
        if (keys === null || keys === void 0 ? void 0 : keys.length) {
            keys.forEach(key => {
                if (key === null || key === void 0 ? void 0 : key.includes('$ct_event_')) {
                    this.deleteValue(key);
                }
            });
        }
    }
}
exports.LocalStorageManager = LocalStorageManager;
//# sourceMappingURL=LocalStorageManager.js.map