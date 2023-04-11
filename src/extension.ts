import type * as vscode from 'vscode'
import { createCommand } from './command'

export function activate(context: vscode.ExtensionContext) {
  const subscriptions = [
    createCommand({
      name: '页面',
      command: 'create-uniapp-view.createPage',
    }),
    createCommand({
      name: '页面',
      options: { subcontract: true },
      command: 'create-uniapp-view.createSubcontractPage',
    }),
    createCommand({
      name: '组件',
      options: { component: true },
      command: 'create-uniapp-view.createComponent',
    }),
  ]

  context.subscriptions.push(...subscriptions)
}

// 停用您的扩展程序时调用此方法
export function deactivate() { }
