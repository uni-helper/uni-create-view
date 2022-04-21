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
exports.writePagesJson = exports.generate = void 0;
const fs = require("fs-extra");
const JSONC = require("comment-json");
const template_1 = require("./template");
const utils_1 = require("./utils");
const path = require("path");
/**
 * 生成模版逻辑
 * @param options
 */
exports.generate = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { names } = options;
    const directoryPath = path.resolve(options.path, names.view);
    // #region  判断路径是否存在 / 符合创建环境
    if (!utils_1.isDirectory(options.path)) {
        return { status: 'error', message: '创建错误, 该路径不是文件夹' };
    }
    if (options.directory) {
        if (!utils_1.isDirectory(directoryPath)) {
            fs.ensureDir(directoryPath);
        }
        else {
            return { status: 'error', message: '创建错误, 该文件夹已存在!' };
        }
    }
    // #endregion
    // #region 生成模版
    const isIndex = options.nameType === 'index';
    const filePath = options.directory ? `${names.view}/${isIndex ? 'index' : names.view}.vue` : `${names.view}.vue`;
    const template = template_1.createViewTemplate(Object.assign({ name: names.view }, options));
    fs.writeFileSync(path.resolve(options.path, filePath), template, { flag: 'w' });
    // #endregion
    // 组件则跳过
    if (options.component) {
        return { status: 'success', message: '创建组件成功!' };
    }
    // 写入 pages.json
    const status = yield exports.writePagesJson(options);
    if (status) {
        return status;
    }
    ;
    return { status: 'success', message: '创建页面成功!' };
});
/**
 * 设置 pages.json
 * @param options
 */
exports.writePagesJson = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { names } = options;
    const isIndex = options.nameType === 'index';
    const pagesJsonFile = yield utils_1.upwardSearchFile(options.path, 'pages.json');
    const pagesDirFile = yield utils_1.upwardSearchFile(options.path, 'pages');
    if (!pagesJsonFile) {
        return { status: 'warning', message: '创建页面成功! 但pages.json未找到' };
    }
    ;
    if (!pagesDirFile) {
        return { status: 'warning', message: '创建页面成功! 但pages目录未找到' };
    }
    ;
    // 获取基于项目目录下的 pages 文件和根目录
    const pagesSplit = options.path.split('pages');
    const rootPath = options.path.replace(pagesSplit[0], '');
    const filePath = options.directory ? `${names.view}/${isIndex ? 'index' : names.view}` : `${names.view}`;
    const pagesJson = JSONC.parse(pagesJsonFile.data);
    const page = { path: filePath, style: { navigationBarTitleText: names.page || names.view } };
    // 如果是分包页面
    if (options.subcontract) {
        pagesJson.subPackages = pagesJson.subPackages || [];
        const findRoot = pagesJson.subPackages.find((v) => v.root === rootPath);
        const root = findRoot || { root: rootPath, pages: [] };
        root.pages.unshift(page);
        if (!findRoot) {
            pagesJson.subPackages.unshift(root);
        }
        ;
    }
    else {
        pagesJson.pages = pagesJson.pages || [];
        page.path = path.join(rootPath, page.path);
        pagesJson.pages.unshift(page);
    }
    const newPagesJson = JSONC.stringify(pagesJson, null, "\t");
    fs.writeFileSync(pagesJsonFile.path, newPagesJson);
});
//# sourceMappingURL=generate.js.map