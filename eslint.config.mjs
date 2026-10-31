import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['out', 'dist', '**/*.d.ts'],
}, {
  // 测试用 Node 自带的 node:test, 不引入 vitest; antfu 的 test 预设默认要求 vitest
  files: ['test/**'],
  rules: { 'test/no-import-node-test': 'off' },
})
