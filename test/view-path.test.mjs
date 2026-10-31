import assert from 'node:assert/strict'
import { test } from 'node:test'
import viewPathModule from '../out/view-path.js'

const { viewPath } = viewPathModule

test('视图路径: 单文件模式就是名称', () => {
  assert.equal(viewPath({ view: 'home', isIndex: true }), 'home')
  assert.equal(viewPath({ view: 'home', isIndex: false }), 'home')
})

test('视图路径: 目录模式的两种文件名', () => {
  assert.equal(viewPath({ view: 'home', directory: true, isIndex: true }), 'home/index')
  assert.equal(viewPath({ view: 'home', directory: true, isIndex: false }), 'home/home')
})

test('视图路径: 不带扩展名, nvue 与 vue 共用同一份', () => {
  // 页面路径里出现 .vue / .nvue 会让 pages.json 指向不存在的页面
  assert.doesNotMatch(viewPath({ view: 'home', directory: true, isIndex: false }), /\.vue$/)
})
