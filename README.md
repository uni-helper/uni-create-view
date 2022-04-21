## create-uniapp-view 简述

右键目录文件夹快速创建`univue-view,` 创建视图页面时将自动添加`pages.json`中!

- 支持 vue3 组件与页面的创建，支持 setup 语法
- 定制化强, 支持配置`css`预编辑器与是否开启`typescript`模板, 以及是否为单文件模式
- 创建页面, 自动查找路径并添加到 `pages.json -> pages` 中
- 创建分包页面, 自动查找路径并添加到 `pages.json -> subPackages` 中
- 支持深度目录创建, 自动查找根目录下路径，写入 `pages.json` 中
- 写入`pages.json`后依然保留注释

VsCode：[mrmaoddxxaa/create-uniapp-view](https://marketplace.visualstudio.com/items?itemName=mrmaoddxxaa.create-uniapp-view)

Github：[TuiMao233/create-uniapp-view](https://github.com/TuiMao233/create-uniapp-view)

MyBlog: [tuimao233/gitee](https://tuimao233.gitee.io/mao-blog/ruan-jian-kai-fa/qian-duan-bi-ji/01-html-chao-wen-ben-biao-ji-yu-yan.html)

### 基本使用（创建 page | component ）

![](https://pshangcheng.wsandos.com/pic/16015205724578)

### 支持深度目录创建

1.3.0 新增扩展能力，如无特殊需求还是建议使用单文件模式。

![](https://qie-online-sale-qiniu.wsandos.com/exts.gif)

### 支持分包页面创建

1.3.0 新增功能，用于创建分包页面，并自动添加至 `subPackages` 字段中。

注意：`cli` 创建的项目需要在`pacakge.json`中添加参数`--minimize`，具体参考官方文档：[dcloud.io](https://uniapp.dcloud.io/collocation/pages?id=subpackages)

![](https://qie-online-sale-qiniu.wsandos.com/1dddw1334.gif)

## 更新日志
- 2.0.2
  - 修复 window 环境下路径 '\\' 问题
- 2.0.1
  - 新增文档内容
- 2.0.0
  - 支持组件页面 style scoped 选项
  - 重构主逻辑
  - 修复无法写入 pages.json
  - 支持 setup 语法
  - 支持 vue3 模版
  - 支持自定义名称 index 或者使用文件夹名称
  - 模版逻辑优化，使用 ejs 实现
  - 优化查询上层文件逻辑
- 1.3.6
  - 新增 composition-api 选项
  - 优化模板判断逻辑
- 1.3.5
  - 新增输入页面名称使用空格分割输入内容时, 左侧为页面文件名称, 右侧为"navigationBarTitleText"名称
- 1.3.4
  - 修复右键后无反应 bug
- 1.3.2
  - 支持pages.json中添加注释
- 1.3.1
  - 支持单文件创建
- 1.3.0
  - 新增 nvue 生命周期兼容性提示
  - 支持深度目录创建页面
  - 支持创建分包页面
  - 清除多余语法
- 1.2.7
  - 更换 `computed` 排版顺序
  - 添加 `onPullDownRefresh` 默认释放上拉刷新 `uni.stopPullDownRefresh()`
