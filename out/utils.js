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
exports.upwardSearchFile = exports.isDirectory = exports.getConfiguration = exports.logger = void 0;
const vscode = require("vscode");
const fs = require("fs-extra");
const path = require("path");
/** 控制台打印信息 */
exports.logger = (type, msg = '') => {
    switch (type) {
        case 'success':
            return vscode.window.showInformationMessage(`Success: ${msg}`);
        case 'warning':
            return vscode.window.showWarningMessage(`Warning: ${msg}`);
        case 'error':
            return vscode.window.showErrorMessage(`Failed: ${msg}`);
    }
};
exports.getConfiguration = (section) => vscode.workspace.getConfiguration().get(section);
exports.isDirectory = (path) => {
    try {
        return fs.statSync(path).isDirectory();
    }
    catch (error) {
        return false;
    }
};
const isFileAccess = (path) => {
    return new Promise(resolve => {
        fs.access(path, (error) => {
            if (error) {
                resolve(false);
            }
            else {
                resolve(true);
            }
            ;
        });
    });
};
exports.upwardSearchFile = (currentPath, fileName) => {
    const recursion = (appPath) => __awaiter(void 0, void 0, void 0, function* () {
        const recursPath = path.resolve(appPath, fileName).replace('\\', '/');
        // 递归出口: 路径是根路径, 停止递归
        if (recursPath.split('/').length < 1) {
            return null;
        }
        if (yield isFileAccess(recursPath || '/')) {
            const stat = fs.lstatSync(recursPath);
            const [isFile, isDirectory] = [stat.isFile(), stat.isDirectory()];
            const data = isFile ? fs.readFileSync(recursPath, 'utf-8') : '';
            return { path: recursPath, data };
        }
        else {
            return recursion(path.resolve(appPath, '../'));
        }
    });
    return recursion(currentPath);
};
//# sourceMappingURL=utils.js.map