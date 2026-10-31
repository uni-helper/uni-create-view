# create-uniapp-view

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/uni-helper/uni-create-view@main/public/logo.png" alt="logo" width="256" height="256" />
</p>

<p align="center">
  <a href="https://github.com/uni-helper/uni-create-view/blob/main/LICENSE"><img src="https://img.shields.io/github/license/uni-helper/uni-create-view?labelColor=005947&color=eee&style=for-the-badge" alt="License"></a>
  <a href="https://github.com/uni-helper/uni-create-view/stargazers"><img src="https://img.shields.io/github/stars/uni-helper/uni-create-view?labelColor=005947&color=eee&style=for-the-badge" alt="GitHub Stars"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mrmaoddxxaa.create-uniapp-view"><img src="https://vsmarketplacebadges.dev/version-short/mrmaoddxxaa.create-uniapp-view.svg?labelColor=005947&color=eee&style=for-the-badge" alt="VSCode version"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mrmaoddxxaa.create-uniapp-view"><img src="https://vsmarketplacebadges.dev/downloads-short/mrmaoddxxaa.create-uniapp-view.svg?labelColor=005947&color=eee&style=for-the-badge" alt="VSCode downloads"></a>
</p>
<p align="center">
  <a href="https://github.com/hairyf"><img src="https://img.shields.io/badge/Author-Hairyf-blue?style=for-the-badge" alt="Author"></a>
  <a href="https://github.com/ModyQyW"><img src="https://img.shields.io/badge/Maintainer-ModyQyW-blue?style=for-the-badge" alt="Maintainer"></a>
</p>

在 VS Code 右键目录文件夹快速创建页面与组件，创建视图页面时将自动写入 `pages.json`！

[改动日志](https://github.com/uni-helper/uni-create-view/blob/main/CHANGELOG.md)

想让 `uni-app` 开发变得更直观、高效？想要更好的 `uni-app` 开发体验？不妨看看 [uni-helper 主页](https://uni-helper.js.org) 和 [uni-helper GitHub Organization](https://github.com/uni-helper)！

## 插件特性

- 📁 创建页面、分包页面，自动向上查找 `pages.json` 并写入
- 📦 可深度目录创建，写入 `pages.json` 后仍可保留注释
- ✨ 可配置 `vue2 | vue3 | composition-api(vue2)` 模板，`vue3` 支持 `<script setup>`
- 🎨 支持用自己写的模板文件替代内置模板（页面与组件各一份）
- 👕 可配置 `css | scss | less | stylus | sass` 预处理器类型
- 🦾 `typescript` 为默认开发语言（可在设置中关闭）

> 使用 `composition-api(vue2)` 模板，建议配合 [uni-composition-api](https://github.com/hairyf/uni-composition-api) 使用

## 使用

从 [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mrmaoddxxaa.create-uniapp-view) 或 [OpenVSX](https://open-vsx.org/extension/mrmaoddxxaa/create-uniapp-view) 安装插件，重启 VSCode 即可。

### 基本使用（page、component）

右键文件夹打开菜单选择创建类型，可选择创建组件、页面、分包页面，空格分隔视图名称与页面名称（`navigationBarTitleText`）。

<p align="center">
<img src="./public/basic.gif" alt="基本使用演示：右键文件夹创建页面与组件" width="786" />
</p>

### 深度目录

`^1.3.0` 新增扩展能力，无特殊需求还是建议使用单文件模式。

![深度目录演示：创建多层目录页面](./public/directory-demo.gif)

### 分包页面

`^1.3.0` 新增功能，用于创建分包页面，并自动添加至 `subPackages` 字段中。

右键的目录就是这条分包的 `root`。如果该目录已经在某个已有分包里面，插件会复用那个分包，把页面写成相对它的路径，不会再建一条嵌套的 `root`。分包页面不能建在 `pages.json` 所在的根目录上；如果目标目录里已经有更深的分包，插件也会报错并指出是哪一条，因为两个 `root` 互相包含时平台构建会失败，怎么合并得你来定。

> 注意：`cli` 创建的项目若遇 vendor.js 过大，可以在 `package.json` 中添加参数 `--minimize`，具体参考官方文档：[dcloud.io](https://uniapp.dcloud.io/collocation/pages?id=subpackages)

![分包页面演示：创建分包页面并写入 subPackages](./public/subpackage-demo.gif)

## 自定义模板

不想用内置模板时，把模板写成一个普通文件，再用设置告诉插件它在哪：

```jsonc
// .vscode/settings.json
{
  "create-uniapp-view.customPageTemplate": "templates/page.vue",
  "create-uniapp-view.customComponentTemplate": "templates/component.vue"
}
```

相对路径以工作区根目录为基准，所以模板文件可以提交进仓库、跟着项目走；也可以填绝对路径。

模板文件是普通的 `.vue` 文本，插件用 [ejs](https://ejs.co/) 渲染，只有想插入变量时才需要写标签：

```vue
<script setup lang="ts">
</script>

<template>
  <view class="<%= options.name %>"><%= options.name %></view>
</template>

<style scoped></style>
```

可用的变量：

| 变量 | 含义 |
| --- | --- |
| `<%= options.name %>` | 输入框里的视图名称 |
| `<%= options.typescript %>` | `create-uniapp-view.typescript` 的布尔值 |
| `<%= options.setup %>` | `create-uniapp-view.setup` 的布尔值 |
| `<%- options.scriptAttrs %>` | `<script ...>` 的属性片段，例如 ` lang="ts" setup` |
| `<%- options.styleAttrs %>` | `<style ...>` 的属性片段，例如 ` lang="scss" scoped` |

`scriptAttrs` / `styleAttrs` 自带前导空格，直接写成 `<script<%- options.scriptAttrs %>>`。其中 `setup` 只在 `create-uniapp-view.template` 为 `vue3` 时出现，所以想复用这两个片段的 `vue3` 项目要把 `template` 保持在 `vue3`。

行为说明：

- 设了自定义模板，`create-uniapp-view.template` 就被整份忽略（填了非法值也不会报错）；`typescript` / `style` / `scoped` / `setup` 只通过上面两个属性片段间接生效；`directory` 与 `name` 照常起作用。
- 模板文件不存在、或 ejs 标签写错时，插件报错并中止，不会创建目录，也不会写入 `pages.json`。
- ejs 会把文件里的 `<%` 当作标签，普通 Vue 模板里不会出现这个序列；万一需要输出字面量，用 `<%%`。

### 从用户代码片段迁移

插件读取的是普通文本文件，不是 VSCode 的 snippets。把片段里的 `body` 数组合并成文件，再做两处替换即可：

- `${1:占位文字}` → `占位文字`（或者直接删掉这段占位）
- `${TM_FILENAME_BASE}` → `<%= options.name %>`

## 扩展设置

所有设置项都在 `create-uniapp-view.` 命名空间下，可在 VSCode 设置中修改，默认值与 `package.json` 中声明一致。

| 设置项 | 默认值 | 说明 |
| --- | --- | --- |
| `create-uniapp-view.typescript` | `true` | 创建视图时是否选择 TypeScript 为默认语言 |
| `create-uniapp-view.directory` | `false` | 创建视图时是否创建同名文件夹 |
| `create-uniapp-view.name` | `index` | 创建文件夹中生成的文件名，可选 `index` 或 `与文件夹同名` |
| `create-uniapp-view.style` | `css` | 创建视图时 CSS 预处理器的类型，可选 `css`、`scss`、`less`、`stylus`、`sass` |
| `create-uniapp-view.scoped` | `true` | 创建模板时，是否使用 `<style scoped>` |
| `create-uniapp-view.setup` | `true` | 创建 vue3 模板时，是否使用 `<script setup>` |
| `create-uniapp-view.template` | `vue3` | 选择创建的模板，可选 `vue2`、`vue3`、`composition-api(vue2)` |
| `create-uniapp-view.customPageTemplate` | 空 | 自定义页面模板文件的路径，相对路径以工作区根为基准；留空则使用内置模板。设置后忽略 `template` |
| `create-uniapp-view.customComponentTemplate` | 空 | 自定义组件模板文件的路径，相对路径以工作区根为基准；留空则使用内置模板。设置后忽略 `template` |

## 命令

| 命令 | 标题 |
| --- | --- |
| `create-uniapp-view.createPage` | 新建uniapp页面 |
| `create-uniapp-view.createSubcontractPage` | 新建uniapp页面(分包) |
| `create-uniapp-view.createComponent` | 新建uniapp组件 |

三个命令都注册在资源管理器右键菜单中，仅在文件夹上显示；从命令面板调用时会提示先在资源管理器中右键目标文件夹。

## 参与贡献

欢迎通过 Issue 或 Pull Request 参与改进本项目。开始前请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)，了解项目结构、本地开发流程、测试方式与提交规范。

## 许可证

[MIT](https://github.com/uni-helper/uni-create-view/blob/main/LICENSE) © 2021-PRESENT [Hairyf](https://github.com/hairyf) & Collaborators
