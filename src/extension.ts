/*
 * @Author: 毛先生
 * @Date: 2020-08-04 11:03:10
 * @LastEditTime: 2020-08-04 16:52:44
 * @LastEditors: 毛先生
 * @Description: 
 * @傻瓜都能写出计算机能理解的程序。优秀的程序员写出的是人类能读懂的代码。
 */
import * as vscode from 'vscode';
import { getCommandExt } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  /** 声明创建页面命令 */
  const createPageExt = getCommandExt({
    tipsViewNmae: '页面',
    extname: 'create-uniapp-view.createPage'
  });
  /** 声明创建分包页面目录 */
  const createSubcontractPage = getCommandExt({
    tipsViewNmae: '页面',
    options: { subcontract: true },
    extname: 'create-uniapp-view.createSubcontractPage'
  });
  /** 声明创建组件命令 */
  const createComponentsExt = getCommandExt({
    tipsViewNmae: '组件',
    options: { component: true },
    extname: 'create-uniapp-view.createComponent'
  });

  /** 进行添加命令 */
  context.subscriptions.push(createPageExt);
  context.subscriptions.push(createSubcontractPage);
  context.subscriptions.push(createComponentsExt);
}

// 停用您的扩展程序时调用此方法
export function deactivate() { }