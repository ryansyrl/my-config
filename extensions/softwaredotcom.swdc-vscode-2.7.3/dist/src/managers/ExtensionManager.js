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
exports.ExtensionManager = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../Util");
const FileManager_1 = require("./FileManager");
const TrackerManager_1 = require("./TrackerManager");
class ExtensionManager {
    constructor() {
        this.ONE_WEEK_MILLIS = 1000 * 60 * 60 * 24 * 7;
        this.INSTALLED_ACTION = 'installed';
        this.UNINSTALLED_ACTION = 'uninstalled';
        let subscriptions = [];
        this.tracker = TrackerManager_1.TrackerManager.getInstance();
        subscriptions.push(vscode_1.extensions.onDidChange(this.onExtensionChange, this));
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    static getInstance() {
        if (!ExtensionManager.instance) {
            ExtensionManager.instance = new ExtensionManager();
        }
        return ExtensionManager.instance;
    }
    dispose() {
        this._disposable.dispose();
    }
    initialize() {
        if ((0, Util_1.getItem)('jwt')) {
            this.initializeExtensionsFile();
            this.reconcileInstalledAndUninstalledPlugins();
        }
    }
    initializeExtensionsFile() {
        const jwt = (0, Util_1.getItem)('jwt');
        // initialize the extension file if it doesn't already exist
        const extensionsFile = (0, Util_1.getExtensionsFile)();
        const eventDate = (0, FileManager_1.getJsonItem)(extensionsFile, 'eventDate');
        const extensionsJwt = (0, FileManager_1.getJsonItem)(extensionsFile, 'jwt');
        // initialize or re-send the installed plugins
        const now = new Date().toISOString();
        if (!eventDate || (new Date().getTime() - new Date(eventDate).getTime() > this.ONE_WEEK_MILLIS) || jwt !== extensionsJwt) {
            (0, FileManager_1.storeJsonData)(extensionsFile, { eventDate: now, jwt: jwt, data: {} });
            this.getInstalledPlugins(now);
        }
    }
    onExtensionChange() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, Util_1.getItem)('jwt')) {
                this.reconcileInstalledAndUninstalledPlugins();
            }
        });
    }
    reconcileInstalledAndUninstalledPlugins() {
        const now = new Date().toISOString();
        const extensionsFile = (0, Util_1.getExtensionsFile)();
        const extensionData = (0, FileManager_1.getJsonItem)(extensionsFile, 'data', {});
        const installedPlugins = this.getInstalledPlugins(now);
        const missingPlugins = Object.keys(extensionData).map((key) => {
            if (!installedPlugins.find((n) => n.id === extensionData[key].id)) {
                const missingPlugin = extensionData[key];
                delete extensionData[key];
                return missingPlugin;
            }
        }).filter((n) => n != null);
        // update the file
        (0, FileManager_1.setJsonItem)(extensionsFile, 'data', extensionData);
        if (missingPlugins.length) {
            // send these events
            missingPlugins.forEach((plugin) => {
                plugin['action'] = this.UNINSTALLED_ACTION;
                this.tracker.trackVSCodeExtension(plugin);
            });
        }
    }
    getInstalledPlugins(now) {
        const extensionsFile = (0, Util_1.getExtensionsFile)();
        const extensionData = (0, FileManager_1.getJsonItem)(extensionsFile, 'data', {});
        const os = (0, Util_1.getOs)();
        const plugins = vscode_1.extensions.all.filter((extension) => extension.packageJSON.publisher != 'vscode' && !extension.packageJSON.isBuiltin).map((extension) => {
            const pkg = extension.packageJSON;
            const existingExtension = extensionData[pkg.id];
            // set the plugin info into the extensions file if it doesn't exist
            if (!existingExtension) {
                const plugin = this.buildInstalledExtensionInfo(pkg, now, os);
                extensionData[pkg.id] = plugin;
                // Track the newly installed extension
                this.tracker.trackVSCodeExtension(plugin);
            }
            return extensionData[pkg.id];
        });
        // write the data back to the file
        (0, FileManager_1.setJsonItem)(extensionsFile, 'data', extensionData);
        return plugins;
    }
    buildInstalledExtensionInfo(pkg, eventDate, os) {
        var _a;
        return {
            action: this.INSTALLED_ACTION,
            event_at: eventDate,
            os: os,
            id: pkg.id,
            publisher: pkg.publisher,
            name: pkg.name,
            display_name: pkg.displayName,
            author: ((_a = pkg.author) === null || _a === void 0 ? void 0 : _a.name) || pkg.publisher,
            version: pkg.version,
            description: this.truncateString(pkg.description, 2048),
            categories: pkg.categories,
            extension_kind: pkg.extensionKind ? [].concat(pkg.extensionKind) : null
        };
    }
    truncateString(str, maxLen) {
        if (str && str.length > maxLen) {
            return str.slice(0, maxLen - 3) + "...";
        }
        else {
            return str;
        }
    }
}
exports.ExtensionManager = ExtensionManager;
//# sourceMappingURL=ExtensionManager.js.map