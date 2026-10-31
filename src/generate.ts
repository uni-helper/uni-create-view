import fs from 'node:fs'
import path from 'node:path'
import * as JSONC from 'comment-json'
import slash from 'slash'
import { resolveSubPackage } from './subpackage'
import { createViewTemplate } from './template'
import { confirmOverwrite, isDirectory, upwardSearchFile } from './utils'
import { viewPath } from './view-path'

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
  setup?: boolean
  scoped?: boolean
  subcontract?: boolean
  /** 生成 .nvue 文件, 内容用 nvue 模板 */
  nvue?: boolean
  /** 自定义模板文件的绝对路径, 为空则使用内置模板 */
  customTemplate?: string
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

  // 分包 root 是右键目录相对 pages.json 所在目录的路径, 右键目录就是项目根时 root 会是空串
  if (options.subcontract && fs.existsSync(path.resolve(options.path, 'pages.json')))
    return { status: 'error', message: '创建错误, 分包页面要建在子目录里, 请在 pages.json 所在目录的子目录上右键' }

  if (options.directory) {
    if (isDirectory(directoryPath))
      return { status: 'error', message: '创建错误, 该文件夹已存在!' }
    if (fs.existsSync(directoryPath))
      return { status: 'error', message: '创建错误, 已存在同名文件, 无法创建文件夹!' }
  }
  // #endregion

  // #region 生成模板
  // 扩展名只影响文件名: pages.json 里的 path 不带扩展名, nvue 也不需要变
  const relativePath = viewPath({ view: names.view, directory: options.directory, isIndex: options.nameType === 'index' })
  const filePath = `${relativePath}.${options.nvue ? 'nvue' : 'vue'}`
  const targetPath = path.resolve(options.path, filePath)
  // 渲染提前到建目录/写文件之前: 模板缺失或 ejs 语法错误时不应留下目录或文件
  const template = createViewTemplate({ name: names.view, ...options })
  if (fs.existsSync(targetPath)) {
    if (fs.statSync(targetPath).isDirectory())
      return { status: 'error', message: '创建错误, 已存在同名文件夹, 请更换名称!' }
    // 覆盖确认也放在建目录之前, 用户取消时不留空目录
    if (!(await confirmOverwrite(filePath)))
      return { status: 'warning', message: '已取消创建, 未覆盖已有文件' }
  }
  // #endregion

  // #region 写文件
  if (options.directory) {
    // 同步创建: 后面的 writeFileSync 依赖目录已存在, 异步会与之竞态
    // mkdir recursive 不因目录已存在而抛错
    fs.mkdirSync(directoryPath, { recursive: true })
  }
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

export async function writePagesJson(options: GenerateOptions): Promise<GenerateResult | undefined> {
  const names = options.names
  // slash 归一化只落局部变量, 不改调用方传入的 options 对象
  const searchPath = slash(options.path)

  const pagesJsonFile = await upwardSearchFile(searchPath, 'pages.json')
  if (!pagesJsonFile)
    return { status: 'warning', message: '创建页面成功! 但pages.json未找到' }

  // pages.json 所在目录即项目根; 右键目录可能就是项目根本身, 必须用 path.relative 而非字符串 replace
  // (字符串 replace 依赖右键路径包含项目根前缀, 恰好相等时无匹配而 no-op, 会把绝对路径写进 pages.json)
  const projectRoot = path.dirname(pagesJsonFile.path)
  const rootPath = slash(path.relative(projectRoot, searchPath))
  const filePath = viewPath({ view: names.view, directory: options.directory, isIndex: options.nameType === 'index' })

  // 读取 pages.json, 准备 page 信息
  let pagesJson: Record<string, any>
  try {
    pagesJson = JSONC.parse(pagesJsonFile.data) as Record<string, any>
  }
  catch (error) {
    // 此时页面文件已写入, 明确告知半成品状态
    return { status: 'error', message: `页面文件已创建, 但 pages.json 解析失败未写入, 请检查其内容 (${error instanceof Error
      ? error.message
      : error})` }
  }
  const page = {
    path: filePath,
    style: { navigationBarTitleText: names.page || names.view },
  }

  // 如果是分包页面
  if (options.subcontract) {
    pagesJson.subPackages = pagesJson.subPackages || []
    const resolution = resolveSubPackage(pagesJson.subPackages, rootPath)
    if (!resolution.ok)
      return { status: 'error', message: `页面文件已创建, 但${resolution.message}` }
    const { subPackage, isNew } = resolution
    // 页面路径必须相对分包 root: 沿用了上级分包时要带上子目录前缀
    page.path = slash(path.relative(resolution.rootPath, `${rootPath}/${page.path}`))
    // 已有同 path 条目时不重复追加, 避免反复创建把 pages.json 写脏
    if (subPackage.pages.some((v: any) => v.path === page.path))
      return { status: 'warning', message: '创建页面成功! 但pages.json已存在该页面条目, 未重复写入' }
    subPackage.pages.push(page)
    if (isNew)
      pagesJson.subPackages.push(subPackage)
  }
  else {
    pagesJson.pages = pagesJson.pages || []
    page.path = slash(path.join(rootPath, page.path))
    if (pagesJson.pages.some((v: any) => v.path === page.path))
      return { status: 'warning', message: '创建页面成功! 但pages.json已存在该页面条目, 未重复写入' }
    pagesJson.pages.push(page)
  }

  const newPagesJson = JSONC.stringify(pagesJson, null, '\t')
  try {
    fs.writeFileSync(pagesJsonFile.path, newPagesJson)
  }
  catch (error) {
    // 此时页面文件已写入, 明确告知半成品状态
    return { status: 'error', message: `页面文件已创建, 但 pages.json 写入失败未更新 (${error instanceof Error
      ? error.message
      : error})` }
  }
}
