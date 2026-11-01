# 改动日志

## [2.3.1] - 2026-11-01

- 修复 CI 发布流程

## [2.3.0] - 2026-11-01

- 新增自定义模板：`create-uniapp-view.customPageTemplate` / `customComponentTemplate` 指向自己的模板文件，相对路径按工作区根目录算，可以提交进仓库跟着项目走。设置后模板整份接管，`template` 配置不再生效
- 自定义模板用 ejs 渲染，可用 `options.name`、`options.typescript`、`options.setup`、`options.scriptAttrs`、`options.styleAttrs`
- 新增 nvue 支持：`create-uniapp-view.nvue` 打开后生成 `.nvue` 文件并改用 nvue 模板（flex 布局、文字放在 `text` 里、根节点 `flex: 1`），`pages.json` 里的 path 与 vue 页面一样不带扩展名
- nvue 模板用选项式写法，`vue2` 与 `vue3` 都能跑，所以不带 `<script setup>`；想要别的骨架用自定义模板覆盖，`.nvue` 后缀仍然生效
- 分包页面复用已有分包的 `root`：在已有分包目录下创建页面时把路径写成相对它的形式，不再新建一条嵌套的 `root`
- 右键目录里已有更深的分包时报错并指出是哪一条，不再写出两个互相包含的 `root`
- 分包页面建在 `pages.json` 所在目录时直接报错，不再写入空的 `root`
- 模板文件不存在或指向目录时报错并带出路径
- 渲染模板与覆盖确认提前到建目录之前：模板出错或用户取消覆盖时不再留下空目录
- 修复 vue2 模板生成的 `</script>` 前一行带尾随空格
- 分包命令的输入提示与空名称报错补上「分包页面」字样
- 页面文件名与 `pages.json` 中的路径改为同一处计算，避免两处算法漂移
- 设置项补充 `scope: resource`，多根工作区可按文件夹配置自定义模板
- 新增 `node:test` 用例（模板渲染、分包 `root` 解析、视图路径），CI 增加 Test 步骤
- 修复 CI 在 Node 22 / 24 上 Test 步骤失败的问题（`node --test` 不带路径参数）
- 发布流程改用 OIDC 发布，CI 工具链与开发依赖同步更新
- README 增加「自定义模板」与「nvue 页面与组件」两节，AGENTS.md、CONTRIBUTING 同步更新

## [2.2.2] - 2026-09-29

- 更新文档

## [2.2.1] - 2026-09-15

- CI 扩展为 Ubuntu / macOS / Windows × Node 22 / 24 / 26 矩阵构建
- CI 与发布流程迁移到 vp 工具链（setup-vp / vpr / vpx）
- 新增 OpenVSX 发布渠道，README 增加 OpenVSX 入口
- 移除 Renovate 配置

## [2.2.0] - 2026-09-15

- 模板根元素从 `div` 改为 `view`，兼容 uni-app 小程序端
- 覆盖已有文件前弹出确认对话框，提供明确的"覆盖 / 取消"按钮，取消或关闭弹窗都不会覆盖
- 页面标题支持包含空格：输入按空格拆分后，首段为名称，其余整体作为 `navigationBarTitleText`
- 新建页面 / 组件的右键菜单命令仅在文件夹上显示
- 从命令面板调用时提示"请在资源管理器中右键目标文件夹后重试"
- 修复右键项目根目录时 pages.json 写入绝对路径的问题
- 重复创建同名页面时不再向 pages.json 追加重复条目
- 模板配置非法（settings.json 中填入未知模板）时给出明确错误提示
- 生成过程中的异常统一转为明确提示，不再弹出 VS Code "command failed" 报错；目标位置存在同名文件时提示无法创建
- 按 Esc 取消输入框不再视为错误
- composition-api(vue2) 模板固定输出完整可用的 `defineComponent` 骨架
- 修复向上查找 pages.json 到达文件系统根目录仍不终止的问题；与 pages.json 同名的目录不再被误认为文件
- 修复目录异步创建与文件写入之间的竞态导致的偶发失败
- 升级 ESLint 至 v10 并迁移到 flat config（@antfu/eslint-config）；包管理从 pnpm 迁移到 npm，不再使用 esbuild 打包，移除 fs-extra 依赖，修复 vsix 打包内容
- 依赖升级：ejs v6、comment-json v4.6、TypeScript v6、@types/node v24
- README 勘误与措辞修正，演示动图本地化

## [2.1.0] - 2023-04-13

- 调整 logo 尺寸

## [2.0.9] - 2023-04-13

- 更新 logo 图标

## [2.0.8] - 2023-04-12

- 调整项目目录、新增 .eslintrc 配置
- 使用 pnpm 替换 yarn 工具
- 添加 LICENSE 协议
- 调整、优化插件默认配置
- README 文档补充优化

## [2.0.6] - 2022-08-01

- 删除页面无用的属性[#13]
- 修复错误的模板语法[#12]
- template 模板 data 更改

## [2.0.4] - 2022-04-22

- 保留支持 `composition-api(vue2)`，文档优化

## [2.0.2] - 2022-04-21

- 修复 window 环境下路径 `\\` 问题

## [2.0.1] - 2022-04-21

- 新增文档内容

## [2.0.0] - 2022-04-21

- 支持组件页面 style scoped 选项
- 重构主逻辑
- 修复无法写入 pages.json
- 支持 setup 语法
- 支持 vue3 模板
- 支持自定义名称 index 或者使用文件夹名称
- 模板逻辑优化，使用 ejs 实现
- 优化查询上层文件逻辑

## [1.3.6]

- 新增 composition-api 选项
- 优化模板判断逻辑

## [1.3.5] - 2021-01-18

- 新增输入页面名称使用空格分割输入内容时, 左侧为页面文件名称, 右侧为"navigationBarTitleText"名称

## [1.3.4] - 2020-12-01

- 修复右键后无反应 bug

## [1.3.2]

- 支持 pages.json 中添加注释

## [1.3.1]

- 支持单文件创建

## [1.3.0]

- 新增 nvue 生命周期兼容性提示
- 支持深度目录创建页面
- 支持创建分包页面
- 清除多余语法

## [1.2.7]

- 更换 `computed` 排版顺序
- 添加 `onPullDownRefresh` 默认释放上拉刷新 `uni.stopPullDownRefresh()`
