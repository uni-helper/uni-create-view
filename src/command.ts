import * as vscode from "vscode";
import { generate } from "./generate";
import { getConfiguration, logger } from "./utils";

export interface CreateCommandOptions {
  /** 命令名称 */
  name: string
  /** 命令 */
  command: string
  /** 配置 */
  options?: { component?: boolean, subcontract?: boolean }
}



export const createCommand = (options: CreateCommandOptions) => {
  return vscode.commands.registerCommand(options.command, async uri => {
    const componentText = `输入${options.name}名称`;
    const pageText = `${componentText}，空格分隔字段（navigationBarTitleText）`;
    const input = await vscode.window.showInputBox({ prompt: options.name === '页面' ? pageText :componentText  });
  
    if (!input) {
      logger("error", `${options.name}名称不能为空!`);
      throw new Error(`${options.name}名称不能为空!`);
    }
    const { message, status } = await generate({
      names: { view: input.split(' ')[0], page: input.split(' ')[1] || '' },
      nameType: getConfiguration('create-uniapp-view.name'),
      path: uri.fsPath,
      component: options.options?.component,
      subcontract: options.options?.subcontract,
      typescript: getConfiguration('create-uniapp-view.typescript'),
      styleType: getConfiguration('create-uniapp-view.style'),
      directory: getConfiguration('create-uniapp-view.directory'),
      template: getConfiguration('create-uniapp-view.template'),
      setup: getConfiguration('create-uniapp-view.setup'),
      scoped: getConfiguration('create-uniapp-view.scoped'),
    });

    logger(status, message);
  });
};