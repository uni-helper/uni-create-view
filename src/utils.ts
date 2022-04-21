import * as vscode from "vscode";
import * as fs from 'fs-extra';
import path = require('path');

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

export const getConfiguration = (section: string) => vscode.workspace.getConfiguration().get(section) as any;

export const isDirectory = (path: string) => {
  try {
    return fs.statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
};

const isFileAccess = (path: string) => {
  return new Promise(resolve => {
    fs.access(path, (error) => {
      if (error) { resolve(false); }
      else { resolve(true); };
    });
  });
};

type SearchFileResult = Promise<{ path: string, data: string } | null | undefined>;

export const upwardSearchFile = (currentPath: string, fileName: string): SearchFileResult=> {
  const recursion = async (appPath: string): Promise<any> => {
    const recursPath = path.resolve(appPath, fileName).replace('\\', '/');
    // 递归出口: 路径是根路径, 停止递归
    if (recursPath.split('/').length < 1) { return null; }

    if (await isFileAccess(recursPath || '/')) {
      const stat = fs.lstatSync(recursPath);
      const [isFile, isDirectory] = [stat.isFile(), stat.isDirectory()];
      const data = isFile ? fs.readFileSync(recursPath, 'utf-8') : '';
      return { path: recursPath, data };
    } else {
      return recursion(path.resolve(appPath, '../'));
    }
  };

  return recursion(currentPath);
};