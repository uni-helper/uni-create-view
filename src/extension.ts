/*
 * @Author: 毛先生
 * @Date: 2020-08-04 11:03:10
 * @LastEditTime: 2020-08-04 16:52:44
 * @LastEditors: 毛先生
 * @Description: 
 * @傻瓜都能写出计算机能理解的程序。优秀的程序员写出的是人类能读懂的代码。
 */
import * as vscode from 'vscode';
import { createCommand } from './command';

export function activate(context: vscode.ExtensionContext) {
  const subscriptions = [
    createCommand({
      name: '页面',
      command: 'create-uniapp-view.createPage'
    }),
    createCommand({
      name: '页面',
      options: { subcontract: true },
      command: 'create-uniapp-view.createSubcontractPage'
    }),
    createCommand({
      name: '组件',
      options: { component: true },
      command: 'create-uniapp-view.createComponent'
    })
  ];

  context.subscriptions.push(...subscriptions);
}

// 停用您的扩展程序时调用此方法
export function deactivate() { }