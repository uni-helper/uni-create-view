import * as vscode from 'vscode'
import { generate } from './generate'
import { getConfiguration, logger } from './utils'

export interface CreateCommandOptions {
  /** 命令名称 */
  name: string
  /** 命令 */
  command: string
  /** 配置 */
  options?: { component?: boolean; subcontract?: boolean }
}

export function createCommand(options: CreateCommandOptions) {
  return vscode.commands.registerCommand(options.command, async (uri) => {
    // 从命令面板调用时没有右键的目录上下文, 在弹输入框前先提示
    if (!uri) {
      logger('error', '请在资源管理器中右键目标文件夹后重试')
      return
    }
    const componentText = `输入${options.name}名称`
    const pageText = `${componentText}，空格分隔字段（navigationBarTitleText）`
    // 提示语由 component 标志决定, 与 generate 的页面/组件分流保持同一判据
    const input = await vscode.window.showInputBox({ prompt: options.options?.component ? componentText : pageText })

    // 用户按 Esc 取消, 静默返回
    if (input === undefined)
      return
    // trim 后为空可同时拦下空串与纯空格输入
    const trimmedInput = input.trim()
    if (!trimmedInput) {
      logger('error', `${options.name}名称不能为空!`)
      return
    }

    try {
      // 首段为文件名, 其余整体作为 navigationBarTitleText (标题可含空格)
      const [view, ...titleParts] = trimmedInput.split(/\s+/)
      const { message, status } = await generate({
        names: { view, page: titleParts.join(' ') },
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
      })
      logger(status, message)
    }
    catch (error) {
      // 兜底: 生成期异常转为单条提示, 避免 VS Code 的 command failed 弹窗
      logger('error', error instanceof Error ? error.message : String(error))
    }
  })
}
