/**
 * 分包 root 的解析。`pages.json` 里 `subPackages[].root` 是分包根目录，
 * `pages[].path` 必须是相对 root 的路径，root 本身不能为空。
 */

export interface SubPackage {
  root: string
  pages: Array<Record<string, any>>
}

/** 从 pages.json 读出来的条目，字段是用户手写的，可能缺失 */
export type RawSubPackage = Partial<SubPackage>

export type SubPackageResolution = ResolvedSubPackage | RejectedSubPackage

/** 命中的已有分包，或新建的分包条目 */
export interface ResolvedSubPackage {
  ok: true
  /** 要写入的分包条目 */
  subPackage: SubPackage
  /** 分包根目录，页面路径要相对它算 */
  rootPath: string
  /** 是否新建条目 */
  isNew: boolean
}

/** root 不合法，不应写入 pages.json */
export interface RejectedSubPackage {
  ok: false
  message: string
}

/**
 * 找出当前右键目录该归到哪个分包。
 *
 * 已有分包的 root 覆盖当前目录时沿用它（取最长匹配），否则 pages.json 里会出现
 * 两个互相嵌套的 root，而页面文件实际只属于外层那个，平台解析出来的分包归属是错的。
 *
 * @param subPackages pages.json 里已有的 subPackages，字段可能缺失
 * @param rootPath 右键目录相对 pages.json 所在目录的路径，用 `/` 分隔
 */
export function resolveSubPackage(
  subPackages: RawSubPackage[],
  rootPath: string,
): SubPackageResolution {
  // 空 root 等于把主包目录整个包成分包，uni-app 不接受
  if (!rootPath)
    return { ok: false, message: '分包页面不能建在 pages.json 所在目录, 请在子目录上右键' }

  const matched = subPackages
    .filter(v => typeof v.root === 'string' && (v.root === rootPath || rootPath.startsWith(`${v.root}/`)))
    // 取最长匹配：分包嵌套时用最内层的 root，页面路径前缀最短
    .sort((a, b) => (b.root as string).length - (a.root as string).length)[0]

  if (matched) {
    return {
      ok: true,
      subPackage: toSubPackage(matched),
      rootPath: matched.root as string,
      isNew: false,
    }
  }

  return {
    ok: true,
    subPackage: { root: rootPath, pages: [] },
    rootPath,
    isNew: true,
  }
}

/** pages 缺失时补空数组，后面可以直接 push */
function toSubPackage(raw: RawSubPackage): SubPackage {
  const subPackage = raw as SubPackage
  subPackage.pages = subPackage.pages || []
  return subPackage
}
