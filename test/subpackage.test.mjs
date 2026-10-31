import assert from 'node:assert/strict'
import { test } from 'node:test'
import subpackage from '../out/subpackage.js'

const { resolveSubPackage } = subpackage

test('分包 root: 已有 root 正好是当前目录时沿用它', () => {
  const existing = {
    root: 'pages/subA',
    pages: [
      { path: 'index' },
    ],
  }
  const result = resolveSubPackage([existing], 'pages/subA')
  assert.equal(result.ok, true)
  assert.equal(result.isNew, false)
  assert.equal(result.rootPath, 'pages/subA')
  assert.equal(result.subPackage, existing)
})

test('分包 root: 当前目录在已有 root 下面时沿用上级, 不新建嵌套 root', () => {
  const existing = {
    root: 'pages/subA',
    pages: [
      { path: 'index' },
    ],
  }
  const result = resolveSubPackage([existing], 'pages/subA/foo')
  assert.equal(result.ok, true)
  assert.equal(result.isNew, false)
  assert.equal(result.rootPath, 'pages/subA')
})

test('分包 root: 多处匹配时取最长的那个', () => {
  const outer = { root: 'pages', pages: [] }
  const inner = { root: 'pages/subA', pages: [] }
  const result = resolveSubPackage([outer, inner], 'pages/subA/foo')
  assert.equal(result.ok, true)
  assert.equal(result.rootPath, 'pages/subA')
  assert.equal(result.subPackage, inner)
})

test('分包 root: 没有匹配时新建条目', () => {
  const result = resolveSubPackage([
    { root: 'pagesA', pages: [] },
  ], 'pagesB')
  assert.equal(result.ok, true)
  assert.equal(result.isNew, true)
  assert.equal(result.rootPath, 'pagesB')
  assert.deepEqual(result.subPackage, { root: 'pagesB', pages: [] })
})

test('分包 root: 只是前缀相同的兄弟目录不算命中', () => {
  // pages/subA 不能匹配 pages/subAB
  const result = resolveSubPackage([
    { root: 'pages/subA', pages: [] },
  ], 'pages/subAB')
  assert.equal(result.ok, true)
  assert.equal(result.isNew, true)
  assert.equal(result.rootPath, 'pages/subAB')
})

test('分包 root: 空 root 直接拒绝', () => {
  const result = resolveSubPackage([], '')
  assert.equal(result.ok, false)
  assert.match(result.message, /子目录/)
})

test('分包 root: 已有条目缺 pages 字段时补空数组', () => {
  const broken = { root: 'pages/subA' }
  const result = resolveSubPackage([broken], 'pages/subA/foo')
  assert.equal(result.ok, true)
  assert.deepEqual(result.subPackage.pages, [])
})
