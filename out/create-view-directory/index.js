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
/*
 * @Author: 毛先生
 * @Date: 2020-08-04 11:06:12
 * @LastEditTime: 2020-08-19 15:16:53
 * @LastEditors: 毛先生
 * @Description:
 * @傻瓜都能写出计算机能理解的程序。优秀的程序员写出的是人类能读懂的代码。
 */
const template_1 = require("../template");
const utils_1 = require("../utils");
const JSONC = require("comment-json");
const fs = require("fs");
const path = require("path");
function createUniAppView(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { create_path, view_name, component, typescript, style_type, subcontract, directory } = options;
        // 判断路径是否存在 / 符合创建环境
        try {
            fs.lstatSync(create_path);
        }
        catch (_a) {
            return { type: 'error', msg: '创建错误, 该路径不是文件夹' };
        }
        try {
            directory && fs.mkdirSync(path.resolve(create_path, view_name));
        }
        catch (error) {
            return { type: 'error', msg: '创建错误, 该文件夹已存在!' };
        }
        // 获取当前创建页面基本路径
        const basePagePath = directory ? `${view_name}/${view_name}` : view_name;
        fs.writeFile(path.resolve(create_path, `${basePagePath}.vue`), template_1.createV2ViewTemplate({ view_name, typescript, style_type, component }), { flag: "w" }, () => { });
        if (component) {
            return { type: 'success', msg: '创建组件成功!' };
        }
        // 递归查找 pages.json 与 src 目录
        const pagesFile = yield utils_1.recursionGetFile(create_path, 'pages.json');
        const srcDirectory = yield utils_1.recursionGetFile(create_path, 'src');
        if (!pagesFile) {
            return { type: 'warning', msg: '创建页面成功! 但pages.json未找到' };
        }
        if (!srcDirectory) {
            return { type: 'warning', msg: '创建页面成功! 但src未找到' };
        }
        // 获取基于 src 目录下的 page 路径
        const srcSplit = srcDirectory.path.split('\\src\\');
        const srcPagePath = srcSplit[srcSplit.length - 1].replace(/\\/g, '/');
        // 去除 // 与 /* */ 注释
        // pagesFile.data = pagesFile.data.replace(/\/\/.*?\n/sg, "\n");
        // pagesFile.data = pagesFile.data.replace(/\/\*.*?\*\//sg, "");
        // 进行添加数据
        let pagesInfo = JSONC.parse(pagesFile.data);
        // let pagesInfo = JSON.parse(pagesFile.data);
        // 如果不是分包页面
        if (!subcontract) {
            pagesInfo.pages.push({
                path: `${srcPagePath}/${basePagePath}`,
                style: { navigationBarTitleText: view_name }
            });
        }
        // 如果是分包页面
        if (subcontract) {
            pagesInfo.subPackages = pagesInfo.subPackages || [];
            const findRootItem = pagesInfo.subPackages.find((item) => {
                return item.root === srcPagePath;
            });
            const pushPageInfo = {
                path: basePagePath,
                style: { navigationBarTitleText: view_name }
            };
            if (!findRootItem) {
                pagesInfo.subPackages.push({
                    root: srcPagePath,
                    pages: [pushPageInfo]
                });
            }
            else {
                findRootItem.pages.push(pushPageInfo);
            }
        }
        pagesInfo = JSONC.stringify(pagesInfo, null, "\t");
        // pagesInfo = JSON.stringify(pagesInfo, null, "\t");
        // 修改文件
        fs.writeFile(pagesFile.path, pagesInfo, { flag: "w" }, () => { });
        return { type: 'success', msg: '创建页面成功' };
    });
}
exports.default = createUniAppView;
//# sourceMappingURL=index.js.map