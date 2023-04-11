import path = require('path')
import slash = require('slash')
import * as vscode from 'vscode'
import * as fs from 'fs-extra'

export type SearchFileResult = Promise<{ path: string; data: string } | null | undefined>

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

export function isDirectory(path: string) {
  try {
    return fs.statSync(path).isDirectory()
  }
  catch (error) {
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
    // 递归出口: 路径是根路径, 停止递归
    if (recursPath.split('/').length < 1)
      return null

    if (await isFileAccess(recursPath || '/')) {
      const stat = fs.lstatSync(recursPath)
      const data = stat.isFile() ? fs.readFileSync(recursPath, 'utf-8') : ''
      return { path: recursPath, data }
    }
    else {
      return recursion(path.resolve(appPath, '../'))
    }
  }

  return recursion(currentPath)
}
