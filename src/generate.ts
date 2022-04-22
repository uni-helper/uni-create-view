import * as fs from 'fs-extra';
import * as JSONC from "comment-json";
import { createViewTemplate } from './template';
import { fixPath, isDirectory, upwardSearchFile } from './utils';
import path = require('path');

export interface GenerateOptions {
  /** 创建路径 */
  path: string

  nameType: string
  /** 多个名称内容 */
  names: {
    /** 视图名称（组件/文件夹/文件） */
    view: string
    /** 页面名称（navigationBarTitleText） */
    page: string
  }

  /** 创建是否包含文件夹 */
  directory?: boolean

  /** options */
  typescript?: boolean
  styleType?: string
  component?: boolean
  template?: string
  setup?: string
  scoped?: boolean
  subcontract?: boolean
}
export interface GenerateResult {
  status: string
  message: string
}

/**
 * 生成模版逻辑
 * @param options 
 */
export const generate = async (options: GenerateOptions): Promise<GenerateResult> => {
  const { names } = options;
  const directoryPath = path.resolve(options.path, names.view);
  // #region  判断路径是否存在 / 符合创建环境
  if (!isDirectory(options.path)) {
    return { status: 'error', message: '创建错误, 该路径不是文件夹' };
  }
  if (options.directory) {
    if (!isDirectory(directoryPath)) { fs.ensureDir(directoryPath); }
    else { return { status: 'error', message: '创建错误, 该文件夹已存在!' }; }
  }
  // #endregion

  // #region 生成模版
  const isIndex = options.nameType === 'index';
  const filePath = options.directory ? `${names.view}/${isIndex? 'index' : names.view}.vue` : `${names.view}.vue`;
  const template = createViewTemplate({ name: names.view, ...options });
  fs.writeFileSync(path.resolve(options.path, filePath), template, { flag: 'w' });
  // #endregion

  // 组件则跳过
  if (options.component) {
    return { status: 'success', message: '创建组件成功!' };
  }

  // 写入 pages.json
  const status = await writePagesJson(options);
  if (status) { return status; };

  return { status: 'success', message: '创建页面成功!' };
};

/**
 * 设置 pages.json
 * @param options 
 */
export const writePagesJson = async (options: GenerateOptions) => {
  const names = options.names;
  options.path = fixPath(options.path);

  const pagesJsonFile = await upwardSearchFile(options.path, 'pages.json');
  if (!pagesJsonFile) { return { status: 'warning', message: '创建页面成功! 但pages.json未找到' }; };

  // 获取基于项目目录下的 pages 文件和根目录
  const pagesSplit = pagesJsonFile.path.split('pages.json');

  const isIndex = options.nameType === 'index';
  const rootPath = options.path.replace(pagesSplit[0], '');
  const filePath = options.directory ? `${names.view}/${isIndex ? 'index' : names.view}` : `${names.view}`;

  // 读取 pages.json, 准备 page 信息
  const pagesJson = JSONC.parse(pagesJsonFile.data) as Record<string, any>;
  const page = { path: filePath, style: { navigationBarTitleText: names.page || names.view } };

  // 如果是分包页面
  if (options.subcontract) {
    pagesJson.subPackages = pagesJson.subPackages || [];
    const findRoot = pagesJson.subPackages.find((v: any) => v.root === rootPath);
    const root = findRoot || { root: rootPath, pages: [] };
    root.pages.push(page);
    if (!findRoot) {pagesJson.subPackages.push(root);};
  } else {
    pagesJson.pages = pagesJson.pages || [];
    page.path = fixPath(path.join(rootPath, page.path));
    pagesJson.pages.push(page);
  }

  const newPagesJson = JSONC.stringify(pagesJson, null, "\t");
  fs.writeFileSync(pagesJsonFile.path, newPagesJson);
};
