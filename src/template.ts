import fs from 'node:fs'
import * as ejs from 'ejs'
import cv2c from './templates/component-composition'
import cv2 from './templates/component-vue2'
import cv3 from './templates/component-vue3'
import nvueComponent from './templates/nvue-component'
import nvuePage from './templates/nvue-page'
import pv2c from './templates/page-composition'
import pv2 from './templates/page-vue2'
import pv3 from './templates/page-vue3'

// Record 索引签名: templateKey 是运行时字符串, 合法性由下方未知模板报错兜底
const ALL_TEMPLATES: Record<string, { page: string, component: string }> = {
  'vue2': { page: pv2, component: cv2 },
  'vue3': { page: pv3, component: cv3 },
  'composition-api(vue2)': { page: pv2c, component: cv2c },
}

// nvue 只有两份模板 (页面 / 组件), 用选项式写法, vue2 与 vue3 都能跑
const NVUE_TEMPLATES: { page: string, component: string } = {
  page: nvuePage,
  component: nvueComponent,
}

export interface CreateViewTemplateOptions {
  template?: string
  name?: string
  typescript?: boolean
  styleType?: string
  component?: boolean
  setup?: boolean
  scoped?: boolean
  /** 生成 nvue 模板, 并让调用方把扩展名换成 .nvue */
  nvue?: boolean
  /** 自定义模板文件的绝对路径，设置后整份接管，忽略 template */
  customTemplate?: string
}

export function createViewTemplate(options: CreateViewTemplateOptions) {
  // 兜底与 create-uniapp-view.template 的默认值保持一致; 模板选择与 setup 判据必须用同一个值
  const templateKey = options.template || 'vue3'
  // 只有真的用内置 nvue 模板时才牵制 scriptAttrs; 自定义模板要不要 setup 由用户文件自己决定
  const useNvueTemplate = Boolean(options.nvue) && !options.customTemplate
  let template: string
  if (options.customTemplate) {
    // 自定义模板整份接管, template 已无关, 因此不再校验它的合法性; 读取失败直接抛, 由 command.ts 统一转提示
    // 只判 existsSync 不够: 指向目录时 readFileSync 抛 EISDIR, 报错里没有路径
    const isFile = fs.existsSync(options.customTemplate) && fs.statSync(options.customTemplate).isFile()
    if (!isFile)
      throw new Error(`自定义模板文件不存在或不是文件: ${options.customTemplate}`)
    template = fs.readFileSync(options.customTemplate, 'utf-8')
  }
  else if (useNvueTemplate) {
    // nvue 模板不分 vue2 / vue3, template 在这里不生效, 同样不校验它的合法性
    template = NVUE_TEMPLATES[options.component ? 'component' : 'page']
  }
  else {
    const templates = ALL_TEMPLATES[templateKey]
    // 手改 settings.json 可绕过 enum 约束, 与其静默渲染错模板不如明确报错 (由 command.ts 统一转提示)
    if (!templates)
      throw new Error(`未知模板: ${templateKey}`)
    template = templates[options.component ? 'component' : 'page']
  }

  const handle = (attrs: (string | boolean | undefined)[]) => {
    const _v = attrs.filter(Boolean).join(' ').trim()
    return _v
      ? ` ${_v}`
      : ''
  }

  const scriptAttrs = handle([
    options.typescript && 'lang="ts"',
    // nvue 模板是选项式写法, 带上 setup 就写不出能跑的代码
    !useNvueTemplate && templateKey === 'vue3' && options.setup && 'setup',
  ])

  const styleAttrs = handle([
    options.styleType !== 'css' && `lang="${options.styleType}"`,
    options.scoped && 'scoped',
  ])

  const data = {
    name: options.name,
    setup: options.setup,
    typescript: options.typescript,
    scriptAttrs,
    styleAttrs,
  }
  return ejs.render(template, { options: data })
}
