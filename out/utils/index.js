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
exports.getCommandExt = exports.recursionGetFile = exports.logger = void 0;
/*
 * @Author: 毛先生
 * @Date: 2020-08-04 11:05:06
 * @LastEditTime: 2021-03-21 22:23:57
 * @LastEditors: Mr.Mao
 * @Description:
 * @傻瓜都能写出计算机能理解的程序。优秀的程序员写出的是人类能读懂的代码。
 */
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const create_view_directory_1 = require("../create-view-directory");
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
/** 递归查找并读取文件, 未找到返回false */
exports.recursionGetFile = (current_path, file_name) => {
    return new Promise(resolve => {
        function recursion(app_path) {
            const recurs_path = path.resolve(app_path, file_name);
            // 递归出口: 路径是根路径, 停止递归
            if (recurs_path.length === (3 + file_name.length)) {
                return false;
            }
            // 文件是否存在
            fs.access(recurs_path, function (error) {
                if (!error) {
                    // 递归出口: 文件存在, 返回文件信息
                    const stat = fs.lstatSync(recurs_path);
                    if (stat.isFile()) {
                        fs.readFile(recurs_path, (error, data) => {
                            if (error) {
                                return resolve(null);
                            }
                            resolve({ path: recurs_path, data: data.toString() });
                        });
                    }
                    if (stat.isDirectory()) {
                        resolve({ path: current_path, data: '' });
                    }
                    // 递归点: 当该文件不存在, 往上一级目录总
                }
                else {
                    recursion(path.resolve(app_path, '../'));
                }
            });
        }
        recursion(current_path);
    });
};
/** 命令基本流程: 拿到路径`uri` -> 组件名称`viewName` -> 创建页面`createUniAppView` */
exports.getCommandExt = (options) => {
    return vscode.commands.registerCommand(options.extname, (uri) => __awaiter(void 0, void 0, void 0, function* () {
        const inputValue = yield vscode.window.showInputBox({ prompt: `输入${options.tipsViewNmae}名称` });
        if (!inputValue) {
            exports.logger("error", `${options.tipsViewNmae}名称不能为空!`);
            throw new Error(`${options.tipsViewNmae}名称不能为空!`);
        }
        const typescript = vscode.workspace.getConfiguration().get('create-uniapp-view.typescript');
        const styleType = vscode.workspace.getConfiguration().get('create-uniapp-view.style');
        const directory = vscode.workspace.getConfiguration().get('create-uniapp-view.directory');
        const compositionApi = vscode.workspace.getConfiguration().get('create-uniapp-view.compositionApi');
        const viewName = inputValue.split(' ')[0];
        const pageName = inputValue.split(' ')[1] || '';
        const status = yield create_view_directory_1.default(Object.assign(Object.assign({}, (options.options || {})), { create_path: uri.fsPath, viewName,
            pageName,
            typescript,
            styleType,
            compositionApi,
            directory }));
        exports.logger(status.type, status.msg);
    }));
};
//# sourceMappingURL=index.js.map