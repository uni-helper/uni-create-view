# Change Log

All notable changes to the "uni-create-view" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [2.0.8]
- 调整项目目录、新增 .eslintrc 配置
- 使用 pnpm 替换 yarn 工具
- 添加 LICENSE 协议
- 调整、优化插件默认配置

## [2.0.6]
- 删除页面无用的属性[#13]
- 修复错误的模板语法[#12]
- template 模板 data 更改

## [2.0.4]
- 保留支持 `composition-api(vue2)`，文档优化

## [2.0.2]
- 修复 window 环境下路径 `\\` 问题

## [2.0.1]
- 新增文档内容

# [2.0.0]
- 支持组件页面 style scoped 选项
- 重构主逻辑
- 修复无法写入 pages.json
- 支持 setup 语法
- 支持 vue3 模版
- 支持自定义名称 index 或者使用文件夹名称
- 模版逻辑优化，使用 ejs 实现
- 优化查询上层文件逻辑

## [1.3.6]
- 新增 composition-api 选项
- 优化模板判断逻辑

## [1.3.5]
- 新增输入页面名称使用空格分割输入内容时, 左侧为页面文件名称, 右侧为"navigationBarTitleText"名称

## [1.3.4]
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
