export interface ViewPathOptions {
  /** 视图名称，建目录时也用作目录名 */
  view: string
  /** 是否创建同名目录 */
  directory?: boolean
  /** 目录里的文件名用 index 还是与目录同名 */
  isIndex: boolean
}

/**
 * 视图相对右键目录的路径，不带扩展名。
 *
 * 两边共用同一份计算：`.vue` / `.nvue` 文件路径是它加扩展名，`pages.json` 里的
 * `path` 原样用它（uni-app 的页面路径不带扩展名，nvue 也一样）。
 */
export function viewPath(options: ViewPathOptions) {
  const base = options.isIndex ? 'index' : options.view
  return options.directory
    ? `${options.view}/${base}`
    : options.view
}
