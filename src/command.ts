import * as vscode from 'vscode'
import { generate } from './generate'
import { getConfiguration, logger, resolveWorkspacePath } from './utils'

export interface CreateCommandOptions {
  /** 展示名称, 用于输入提示与错误文案 (命令标识符见 command 字段) */
  name: string
  /** 命令 */
  command: string
  /** 配置 */
  options?: { component?: boolean, subcontract?: boolean }
}

export function createCommand(options: CreateCommandOptions) {
  return vscode.commands.registerCommand(options.command, async (uri?: vscode.Uri) => {
    // 从命令面板调用时没有右键的目录上下文, 在弹输入框前先提示
    if (!uri) {
      logger('error', '请在资源管理器中右键目标文件夹后重试')
      return
    }
    // 带 scope 读取资源级配置, 否则多根工作区里按文件夹设置的项不生效
    const configuration = (key: string) => getConfiguration(`create-uniapp-view.${key}`, uri)
    const componentText = `输入${options.name}名称`
    const pageText = `${componentText}，空格分隔字段（navigationBarTitleText）`
    // 提示语由 component 标志决定, 与 generate 的页面/组件分流保持同一判据
    const input = await vscode.window.showInputBox({
      prompt: options.options?.component ? componentText : pageText,
    })

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
        names: {
          view,
          page: titleParts.join(' '),
        },
        nameType: configuration('name'),
        path: uri.fsPath,
        component: options.options?.component,
        subcontract: options.options?.subcontract,
        typescript: configuration('typescript'),
        styleType: configuration('style'),
        directory: configuration('directory'),
        template: configuration('template'),
        setup: configuration('setup'),
        scoped: configuration('scoped'),
        nvue: configuration('nvue'),
        customTemplate: resolveWorkspacePath(uri, configuration(
          options.options?.component ? 'customComponentTemplate' : 'customPageTemplate',
        )),
      })
      logger(status, message)
    }
    catch (error) {
      // 兜底: 生成期异常转为单条提示, 避免 VS Code 的 command failed 弹窗
      logger('error', error instanceof Error
        ? error.message
        : String(error))
    }
  })
}
