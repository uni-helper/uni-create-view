# create-uniapp-view

uni-app 的 VS Code 扩展：在资源管理器里右键文件夹，快速生成页面或组件的 `.vue` 文件，页面还会自动写进最近的 `pages.json`（`pages` 或 `subPackages`）并保留原有注释。仓库名是 `uni-create-view`，扩展 id 是 `mrmaoddxxaa.create-uniapp-view`，publisher 为 `mrmaoddxxaa`（原作者），不是 `uni-helper`。市场与 OpenVSX 的链接、徽章必须用这个 id。

## 项目

- **语言与运行时**：TypeScript（strict、target ES2020、CommonJS），用 `tsc` 直接编译到 `out/`，没有打包步骤（esbuild 在 2.2.0 移除）。`comment-json`、`ejs`、`slash` 三个运行时依赖靠 `files` 里的 `node_modules` 一起打进 VSIX，新增运行时依赖前先看包体积。
- **工具链**：npm，`package.json` 的 `packageManager` 固定为 `npm@12.2.1`，`package-lock.json` 入库（已从 pnpm 迁移）。本地 Node 版本看 `.node-version`（26），CI 覆盖 22 / 24 / 26。ESLint 10 用 flat config，配置源是 `eslint.config.mjs` 里的 `@antfu/eslint-config`，忽略 `out`、`dist`、`**/*.d.ts`。发版用 bumpp。仓库没有测试框架，CI（`.github/workflows/ci.yml`，`voidzero-dev/setup-vp@v1.22.0`）只跑 `vpr lint` 和 `vpr compile`，矩阵为 Node 22 / 24 / 26 × ubuntu / macos / windows。对使用者的版本要求只有 `engines.vscode: ^1.137.0`。
- **产物**：VSIX 包含 `CHANGELOG.md`、`LICENSE`、`node_modules`、`out`、`public`（见 `files` 与 `icon`）。推 `v*` tag 触发发布，同时上架 VS Code Marketplace 与 OpenVSX。

## 常用命令

```bash
npm install
npm run compile      # tsc → out/
npm run watch        # tsc -watch; F5「运行扩展」用它作为 preLaunchTask
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run lint:fix
npm run release      # bumpp — 提版本号、提交、打 tag 并推送; v* tag 触发 .github/workflows/release.yml
```

发布流程：`vpx @vscode/vsce@3.9.2 publish`（VSCE_PAT）→ `vpx ovsx@1.2.0 publish`（OVSX_PAT）→ changelogithub 创建 GitHub Release（GITHUB_TOKEN）。`@vscode/vsce` 和 `ovsx` 不在 devDependencies 里，`vpx` 会从 registry 拉取，所以版本号写死在 workflow 里。

## 架构

| 文件 | 职责 |
|---|---|
| `src/extension.ts` | 入口，注册三个命令 |
| `src/command.ts` | 命令封装：拦住没有 URI 的情况（从命令面板调用时提示右键），弹输入框，拆分输入，把生成阶段的异常统一转成提示 |
| `src/generate.ts` | 主流程：校验目标目录，`directory` 打开时同步建目录，写入 `.vue`（覆盖前弹模态确认），再调 `writePagesJson` |
| `src/utils.ts` | `logger`（面向用户的消息框）、`getConfiguration`（读带 `create-uniapp-view.` 前缀的完整 key）、`confirmOverwrite`（模态框，关闭或按 Esc 视为拒绝）、`upwardSearchFile` |
| `src/template.ts` | 按 `template` × `component` 从六份模板里选一份，用 ejs 渲染；模板名未知时抛错 |
| `src/templates/*.ts` | 六份 ejs 模板字符串：页面 / 组件 × vue2 / vue3 / composition-api |

### 行为约束（不要改坏）

- 写进 `pages.json` 的页面路径以 `pages.json` 所在目录为基准，用 `path.relative` 算，不能用右键目录的绝对路径，也不能用字符串 `replace`。右键目录正好是项目根时 `replace` 匹配不到、变成空操作，会把绝对路径写进 `pages.json`（2.2.0 修过）。
- 已存在的页面条目不重复追加。
- `.vue` 文件已写入但 `pages.json` 解析或写入失败时，提示必须说明这是半成品状态，因为页面文件存在却没有注册。
- 建目录用同步的 `mkdirSync`。异步 mkdir 会和 `writeFileSync` 抢时序，偶发失败（2.2.0 修过）。
- `upwardSearchFile` 从右键目录往上找，到文件系统根停止；同名目录不算命中（有 lstat 判断）。
- 输入按空白拆分：第一段是文件或文件夹名，其余拼起来作为 `navigationBarTitleText`（标题可以带空格）。按 Esc 是静默取消；输入为空或全是空白时报错并中止。
- `template.ts` 对空值和非法值的处理不同：空值回落到 `vue3`，非空但未知的名字抛错。手改 `settings.json` 能绕过 enum 约束，这个抛错是有意为之。

## 约定

- **面向用户的文案用简体中文**：命令标题、输入提示、错误与警告、覆盖对话框。
- **文档语言**：README、CONTRIBUTING 和本文件都是简体中文，源码注释也用中文。
- **配置命名空间**：所有配置项都是 `create-uniapp-view.*`，读取时带完整 key。`package.json` 里的 `contributes.configuration` 和 `contributes.commands` 是面向用户的契约，README 的「扩展设置」「命令」两节必须与之同步。
- **分支与提交**：分支用 `feat/xxx`、`fix/xxx`、`docs/xxx`，提交遵循 Conventional Commits。
- **发版耦合**：每次发版都要先在 CHANGELOG.md 补上版本条目并提交，再跑 `npm run release`。没有打包步骤，所以 VSIX 直接带 `node_modules`。
