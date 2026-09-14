import fs from 'node:fs'
import path from 'node:path'
import slash from 'slash'
import * as vscode from 'vscode'

export type SearchFileResult = Promise<{ path: string, data: string } | null | undefined>

export function logger(type: string, message = '') {
  switch (type) {
    case 'success':
      return vscode.window.showInformationMessage(`Success: ${message}`)
    case 'warning':
      return vscode.window.showWarningMessage(`Warning: ${message}`)
    case 'error':
      return vscode.window.showErrorMessage(`Failed: ${message}`)
  }
}

export function getConfiguration(section: string) {
  return vscode.workspace.getConfiguration().get<any>(section)
}

// 覆盖已有文件前的模态确认; 用户关闭弹窗或按 Esc 视为拒绝
export async function confirmOverwrite(fileName: string) {
  const answer = await vscode.window.showWarningMessage(`文件 ${fileName} 已存在, 是否覆盖?`, { modal: true }, '覆盖', '取消')
  return answer === '覆盖'
}

export function isDirectory(path: string) {
  try {
    return fs.statSync(path).isDirectory()
  }
  catch {
    return false
  }
}

export function isFileAccess(path: string) {
  return new Promise((resolve) => {
    fs.access(path, (error: any) => {
      if (error)
        resolve(false)
      else resolve(true)
    })
  })
}

export function upwardSearchFile(currentPath: string, fileName: string): SearchFileResult {
  const recursion = async (appPath: string): Promise<any> => {
    const recursPath = slash(path.resolve(appPath, fileName))
    if (await isFileAccess(recursPath)) {
      const stat = fs.lstatSync(recursPath)
      // 同名目录不作为命中, 继续向上找真正的文件
      if (stat.isFile())
        return { path: recursPath, data: fs.readFileSync(recursPath, 'utf-8') }
    }
    // 递归出口: 已到根路径仍未找到, 停止递归 (path.resolve 在根路径上不再变化)
    const parent = path.resolve(appPath, '../')
    if (parent === appPath)
      return null
    return recursion(parent)
  }

  return recursion(currentPath)
}
