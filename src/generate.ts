import path = require('path')
import * as fs from 'fs-extra'
import * as JSONC from 'comment-json'
import slash = require('slash')
import { createViewTemplate } from './template'
import { confirmOverwrite, isDirectory, upwardSearchFile } from './utils'

export interface GenerateOptions {
  /** 创建路径 */
  path: string

  nameType: string
  /** 多个名称内容 */
  names: {
    /** 视图名称（组件/文件夹/文件） */
    view: string
    /** 页面名称（navigationBarTitleText） */
    page: string
  }

  /** 创建是否包含文件夹 */
  directory?: boolean

  /** options */
  typescript?: boolean
  styleType?: string
  component?: boolean
  template?: string
  setup?: string
  scoped?: boolean
  subcontract?: boolean
}
export interface GenerateResult {
  status: string
  message: string
}

export async function generate(options: GenerateOptions): Promise<GenerateResult> {
  const names = options.names
  const directoryPath = path.resolve(options.path, names.view)

  // #region 判断路径是否存在 / 符合创建环境
  if (!isDirectory(options.path))
    return { status: 'error', message: '创建错误, 该路径不是文件夹' }

  if (options.directory) {
    if (isDirectory(directoryPath))
      return { status: 'error', message: '创建错误, 该文件夹已存在!' }
    if (fs.existsSync(directoryPath))
      return { status: 'error', message: '创建错误, 已存在同名文件, 无法创建文件夹!' }
    // 同步创建: 后面的 writeFileSync 依赖目录已存在, 异步 ensureDir 会与之竞态
    fs.ensureDirSync(directoryPath)
  }
  // #endregion

  // #region 生成模版
  const isIndex = options.nameType === 'index'
  const filePath = options.directory ? `${names.view}/${isIndex ? 'index' : names.view}.vue` : `${names.view}.vue`
  const targetPath = path.resolve(options.path, filePath)
  if (fs.existsSync(targetPath)) {
    if (fs.statSync(targetPath).isDirectory())
      return { status: 'error', message: '创建错误, 已存在同名文件夹, 请更换名称!' }
    if (!(await confirmOverwrite(filePath)))
      return { status: 'warning', message: '已取消创建, 未覆盖已有文件' }
  }
  const template = createViewTemplate({ name: names.view, ...options })
  fs.writeFileSync(targetPath, template, { flag: 'w' })
  // #endregion

  // 组件则跳过
  if (options.component)
    return { status: 'success', message: '创建组件成功!' }

  // 写入 pages.json
  const status = await writePagesJson(options)
  if (status)
    return status

  return { status: 'success', message: '创建页面成功!' }
}

export async function writePagesJson(options: GenerateOptions) {
  const names = options.names
  options.path = slash(options.path)

  const pagesJsonFile = await upwardSearchFile(options.path, 'pages.json')
  if (!pagesJsonFile)
    return { status: 'warning', message: '创建页面成功! 但pages.json未找到' }

  // 获取基于项目目录下的 pages 文件和根目录
  const pagesSplit = pagesJsonFile.path.split('pages.json')

  const isIndex = options.nameType === 'index'
  const rootPath = options.path.replace(pagesSplit[0], '')
  const filePath = options.directory ? `${names.view}/${isIndex ? 'index' : names.view}` : `${names.view}`

  // 读取 pages.json, 准备 page 信息
  let pagesJson: Record<string, any>
  try {
    pagesJson = JSONC.parse(pagesJsonFile.data) as Record<string, any>
  }
  catch (error) {
    // 此时页面文件已写入, 明确告知半成品状态
    return { status: 'error', message: `页面文件已创建, 但 pages.json 解析失败未写入, 请检查其内容 (${error instanceof Error ? error.message : error})` }
  }
  const page = { path: filePath, style: { navigationBarTitleText: names.page || names.view } }

  // 如果是分包页面
  if (options.subcontract) {
    pagesJson.subPackages = pagesJson.subPackages || []
    const findRoot = pagesJson.subPackages.find((v: any) => v.root === rootPath)
    const root = findRoot || { root: rootPath, pages: [] }
    root.pages.push(page)
    if (!findRoot)
      pagesJson.subPackages.push(root)
  }
  else {
    pagesJson.pages = pagesJson.pages || []
    page.path = slash(path.join(rootPath, page.path))
    pagesJson.pages.push(page)
  }

  const newPagesJson = JSONC.stringify(pagesJson, null, '\t')
  try {
    fs.writeFileSync(pagesJsonFile.path, newPagesJson)
  }
  catch (error) {
    // 此时页面文件已写入, 明确告知半成品状态
    return { status: 'error', message: `页面文件已创建, 但 pages.json 写入失败未更新 (${error instanceof Error ? error.message : error})` }
  }
}
