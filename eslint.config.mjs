// @antfu/eslint-config 单一配置入口; 继承原 .eslintrc 的忽略项(git 内 out/dist 产物与声明文件)
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['out', 'dist', '**/*.d.ts'],
})
