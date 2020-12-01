/*
 * @Author: 毛先生
 * @Date: 2020-08-04 11:05:06
 * @LastEditTime: 2020-08-04 16:51:38
 * @LastEditors: 毛先生
 * @Description: 
 * @傻瓜都能写出计算机能理解的程序。优秀的程序员写出的是人类能读懂的代码。
 */
import * as vscode from "vscode";
import fs = require('fs');
import path = require('path');
import createUniAppView from '../create-view-directory';

/** 控制台打印信息 */
export const logger = (type: string, msg = '') => {
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
export const recursionGetFile = (current_path: string, file_name: string): ERecurs => {
  return new Promise(resolve => {
    function recursion(app_path: string) {
      const recurs_path = path.resolve(app_path, file_name);
      // 递归出口: 路径是根路径, 停止递归
      if (recurs_path.length === (3 + file_name.length)) {return false;}
      // 文件是否存在
      fs.access(recurs_path, function (error: any) {
        if (!error) {
          // 递归出口: 文件存在, 返回文件信息
          const stat = fs.lstatSync(recurs_path);
          if (stat.isFile()){
            fs.readFile(recurs_path, (error, data) => {
              if (error) {return resolve(null);}
              resolve({ path: recurs_path, data: data.toString() });
            });
          }
          if (stat.isDirectory()){
            resolve({path: current_path, data: ''});
          }
          // 递归点: 当该文件不存在, 往上一级目录总
        } else { recursion(path.resolve(app_path, '../')); }
      });
    }
    recursion(current_path);
  });
};
/** 命令基本流程: 拿到路径`uri` -> 组件名称`view_name` -> 创建页面`createUniAppView` */
export const getCommandExt = (options: GetCommandExtOpts) => {
  return vscode.commands.registerCommand(options.extname, async uri => {
    const inputValue = await vscode.window.showInputBox({ prompt: `输入${options.tipsViewNmae}名称` });
    if (!inputValue) {
      logger("error", `${options.tipsViewNmae}名称不能为空!`);
      throw new Error(`${options.tipsViewNmae}名称不能为空!`);
    }
    const typescript = vscode.workspace.getConfiguration().get('create-uniapp-view.typescript');
    const style_type = vscode.workspace.getConfiguration().get('create-uniapp-view.style');
    const directory = vscode.workspace.getConfiguration().get('create-uniapp-view.directory');
    const status = await createUniAppView({
      ...(options.options || {}),
      create_path: uri.fsPath,
      view_name: inputValue,
      typescript, style_type,
      directory
    });
    logger(status.type, status.msg);
  });
};