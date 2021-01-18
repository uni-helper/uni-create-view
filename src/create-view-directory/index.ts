/*
 * @Author: 毛先生
 * @Date: 2020-08-04 11:06:12
 * @LastEditTime: 2021-01-18 19:22:44
 * @LastEditors: Mr.Mao
 * @Description: 
 * @傻瓜都能写出计算机能理解的程序。优秀的程序员写出的是人类能读懂的代码。
 */
import { createV2ViewTemplate } from "../template";
import { recursionGetFile } from '../utils';
import * as JSONC from "comment-json";
import fs = require('fs');
import path = require('path');
export default async function createUniAppView(options: EcreateUniAppView) {
  const {
    create_path, view_name, page_name, component,
    typescript, style_type, subcontract, directory
  } = options;

  // 判断路径是否存在 / 符合创建环境
  try { fs.lstatSync(create_path); }
  catch { return { type: 'error', msg: '创建错误, 该路径不是文件夹' }; }
  try { directory && fs.mkdirSync(path.resolve(create_path, view_name)); }
  catch (error) { return { type: 'error', msg: '创建错误, 该文件夹已存在!' }; }

  // 获取当前创建页面基本路径
  const basePagePath = directory ? `${view_name}/${view_name}` : view_name;
  fs.writeFile(
    path.resolve(create_path, `${basePagePath}.vue`),
    createV2ViewTemplate({ view_name, typescript, style_type, component }),
    { flag: "w" }, () => { }
  );

  if (component) {
    return { type: 'success', msg: '创建组件成功!' };
  }
  // 递归查找 pages.json 与 src 目录
  const pagesFile = await recursionGetFile(create_path, 'pages.json');
  const srcDirectory = await recursionGetFile(create_path, 'src');
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
      style: { navigationBarTitleText: page_name || view_name }
    });
  }
  // 如果是分包页面
  if (subcontract) {
    pagesInfo.subPackages = pagesInfo.subPackages || [];
    const findRootItem = pagesInfo.subPackages.find((item: any) => {
      return item.root === srcPagePath;
    });
    const pushPageInfo = {
      path: basePagePath,
      style: { navigationBarTitleText: page_name || view_name }
    };
    if (!findRootItem) {
      pagesInfo.subPackages.push({
        root: srcPagePath,
        pages: [pushPageInfo]
      });
    } else {
      findRootItem.pages.push(pushPageInfo);
    }
  }
  pagesInfo = JSONC.stringify(pagesInfo, null, "\t");
  // pagesInfo = JSON.stringify(pagesInfo, null, "\t");
  // 修改文件
  fs.writeFile(
    pagesFile.path,
    pagesInfo,
    { flag: "w" }, () => { }
  );
  return { type: 'success', msg: '创建页面成功' };
}