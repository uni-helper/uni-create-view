import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import template from '../out/template.js'

// 只覆盖不依赖 vscode 的模块: utils.ts 在扩展宿主外加载不了, generate.ts 的写盘顺序靠 F5 手工验证
const { createViewTemplate } = template
// out/ 是 tsc 的产物, 所以测试从编译结果导入; npm test 会先跑 compile
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'create-uniapp-view-'))

function fixture(name, content) {
  const file = path.join(tmp, name)
  fs.writeFileSync(file, content)
  return file
}

test('自定义模板: 没有标签时原样输出', () => {
  const file = fixture('static.vue', '<template><view>hi</view></template>\n')
  assert.equal(createViewTemplate({ customTemplate: file, name: 'demo' }), '<template><view>hi</view></template>\n')
})

test('自定义模板: 可以用 ejs 变量和属性片段', () => {
  const file = fixture('ejs.vue', '<view class="<%= options.name %>"></view><script<%- options.scriptAttrs %>></script><style<%- options.styleAttrs %>></style>')
  const output = createViewTemplate({
    customTemplate: file,
    name: 'my-page',
    template: 'vue3',
    typescript: true,
    setup: true,
    styleType: 'scss',
    scoped: true,
  })
  assert.equal(output, '<view class="my-page"></view><script lang="ts" setup></script><style lang="scss" scoped></style>')
})

test('自定义模板: 设了自定义模板后, template 的非法值不再报错', () => {
  const file = fixture('ignores-template.vue', 'static')
  assert.equal(createViewTemplate({ customTemplate: file, template: 'nonsense' }), 'static')
})

test('自定义模板: 文件不存在时报错并带出路径', () => {
  const missing = path.join(tmp, 'missing.vue')
  assert.throws(
    () => createViewTemplate({ customTemplate: missing }),
    error => error.message.includes(missing) && error.message.includes('不存在'),
  )
})

test('自定义模板: 指向目录时报错并带出路径', () => {
  // 只判 existsSync 的话这里会漏出 EISDIR, 报错里没有路径
  assert.throws(
    () => createViewTemplate({ customTemplate: tmp }),
    error => error.message.includes(tmp) && error.message.includes('不是文件'),
  )
})

test('内置模板: template 的非法值仍然报错', () => {
  assert.throws(() => createViewTemplate({ template: 'nonsense' }), /未知模板: nonsense/)
})

test('内置模板: 生成的每一行都不以空格结尾', () => {
  const keys = ['vue2', 'vue3', 'composition-api(vue2)']
  for (const key of keys) {
    for (const component of [false, true]) {
      for (const typescript of [false, true]) {
        const output = createViewTemplate({
          template: key,
          component,
          typescript,
          name: 'demo',
          styleType: 'css',
        })
        const bad = output.split('\n').filter(line => line !== line.trimEnd())
        assert.deepEqual(bad, [], `${key} ${component ? '组件' : '页面'} ts=${typescript} 有行尾空格`)
      }
    }
  }
})
