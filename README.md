## create-uniapp-view 简述

右键目录文件夹快速创建`univue-view,` 创建视图页面时将自动添加`pages.json`中!

- 可修改配置, 支持配置`css`预编辑器与是否开启`typescript`模板, 以及是否为单文件模式
- 创建页面, 自动查找路径并添加到 `pages.json -> pages` 中
- 创建分包页面, 自动查找路径并添加到 `pages.json -> subPackages` 中
- 支持深度目录创建, 自动查找`src`目录下路径
- 写入`pages.json`后依然保留注释

github：[https://github.com/TuiMao233/create-uniapp-view](https://github.com/TuiMao233/create-uniapp-view)

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