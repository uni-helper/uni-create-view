import * as ejs from 'ejs'
import cv2c from './templates/component-composition'
import cv2 from './templates/component-vue2'
import cv3 from './templates/component-vue3'
import pv2c from './templates/page-composition'
import pv2 from './templates/page-vue2'
import pv3 from './templates/page-vue3'

// Record 索引签名: templateKey 是运行时字符串, 合法性由下方未知模板报错兜底
const ALL_TEMPLATES: Record<string, { page: string, component: string }> = {
  'vue2': { page: pv2, component: cv2 },
  'vue3': { page: pv3, component: cv3 },
  'composition-api(vue2)': { page: pv2c, component: cv2c },
}

export interface CreateViewTemplateOptions {
  template?: string
  name?: string
  typescript?: boolean
  styleType?: string
  component?: boolean
  setup?: boolean
  scoped?: boolean
}

export function createViewTemplate(options: CreateViewTemplateOptions) {
  // 兜底与 create-uniapp-view.template 的默认值保持一致; 模板选择与 setup 判据必须用同一个值
  const templateKey = options.template || 'vue3'
  const templates = ALL_TEMPLATES[templateKey]
  // 手改 settings.json 可绕过 enum 约束, 与其静默渲染错模板不如明确报错 (由 command.ts 统一转提示)
  if (!templates)
    throw new Error(`未知模板: ${templateKey}`)
  const template = templates[options.component ? 'component' : 'page']

  const handle = (attrs: (string | boolean | undefined)[]) => {
    const _v = attrs.filter(Boolean).join(' ').trim()
    return _v ? ` ${_v}` : ''
  }

  const scriptAttrs = handle([
    options.typescript && 'lang="ts"',
    templateKey === 'vue3' && options.setup && 'setup',
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
