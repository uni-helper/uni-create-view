# 参与贡献

感谢你对 `create-uniapp-view` 的关注！本文档将帮助你快速了解项目结构、本地开发流程、测试方式和提交规范。

## 前置条件

- Node.js 22 / 24 / 26（CI 矩阵覆盖这三个版本；仓库没有 `.node-version` 等 pin 文件，本地用较新版本即可）
- npm（包管理工具，仓库带 `package-lock.json`；未通过 `packageManager` 固定版本）
- Git（用于克隆与版本管理）
- VSCode `^1.137.0`（扩展的引擎要求，本地调试也需要）

## 仓库结构

```
uni-create-view/
├── src/
│   ├── extension.ts          # 插件入口，注册三个命令
│   ├── command.ts            # 命令实现：输入框、名称与标题拆分、错误转提示
│   ├── generate.ts           # 核心逻辑：创建 .vue 文件、向上查找并写入 pages.json（含分包）
│   ├── template.ts           # 模板选择与 ejs 渲染
│   ├── templates/            # 六份模板：页面/组件 × vue2/vue3/composition-api
│   └── utils.ts              # 向上查找文件、覆盖确认、日志提示等工具
├── public/                   # banner、logo 与 README 演示动图，随 vsix 打包
├── .github/workflows/        # CI 与发布流程
├── package.json              # 插件清单：contributes 声明配置项、命令、右键菜单
└── ...
```

`out/` 是 `tsc` 的编译产物（已 gitignore，但会随 vsix 打包），不要手改。

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 编译（tsc，输出到 out/）
npm run compile
```

调试时在 VSCode 中按 `F5`（Run Extension 配置）：它会先启动 `watch` 任务，再打开一个加载了本扩展的"扩展开发宿主"窗口，在其中右键文件夹即可实际体验创建流程。

## 测试与检查

本仓库没有自动化测试，提交前请执行：

```bash
npm run lint         # ESLint（@antfu/eslint-config flat config）
npm run typecheck    # tsc --noEmit
npm run compile      # 确认能编译出 out/
```

### 测试说明

- 涉及生成逻辑的改动，建议在扩展开发宿主里实际创建一次页面 / 组件 / 分包页面，检查 `.vue` 文件内容与 `pages.json` 的写入结果。
- 重点验证：已有 `pages.json` 中的注释不被破坏、重复创建不会写入重复条目、右键项目根目录时写入的是相对路径。

## 提交规范

1. Fork 本仓库并克隆到本地。
2. 基于 `main` 创建功能分支：`feat/xxx`、`fix/xxx`、`docs/xxx` 等。
3. 采用 [Conventional Commits](https://www.conventionalcommits.org/) 格式（如 `fix: 修复 pages.json 重复写入`）。
4. 提交前执行：
   ```bash
   npm run lint
   npm run typecheck
   npm run compile
   ```
5. 推送到远端后发起 Pull Request，描述改动内容与关联 Issue。

## Pull Request 指南

- 保持 PR 范围聚焦，一次只解决一个问题。
- 新增或修改配置项、命令时，同步更新 `package.json` 的 `contributes` 与 README 的「扩展设置」「命令」两节。
- 确保 CI 通过（CI 会在 Node 22/24/26 × Linux/macOS/Windows 上执行 lint 和 compile）。
- 如需讨论方案，可在 Issue 中先行沟通。

## 发布

维护者先在 CHANGELOG.md 补上版本条目，然后运行 `npm run release`（[bumpp](https://github.com/antfu/bumpp) 提升版本、提交、打 tag 并推送）；tag 推送会触发 Release workflow，发布到 VSCode Marketplace（`VSCE_PAT`）与 OpenVSX（`OVSX_PAT`），并用 changelogithub 创建 GitHub Release。

## 行为准则

参与本项目请遵守 [组织级行为准则](https://github.com/uni-helper/.github/blob/main/CODE_OF_CONDUCT.md)。

感谢你的贡献！如有疑问，欢迎在 [GitHub Issues](https://github.com/uni-helper/uni-create-view/issues) 中提问。
