import * as ejs from 'ejs'
import cv2c from './templates/component-composition'
import cv2 from './templates/component-vue2'
import cv3 from './templates/component-vue3'
import pv2c from './templates/page-composition'
import pv2 from './templates/page-vue2'
import pv3 from './templates/page-vue3'

const ALL_TEMPLATES = {
  ['vue2' as string]: { page: pv2, component: cv2 },
  ['vue3' as string]: { page: pv3, component: cv3 },
  ['composition-api(vue2)' as string]: { page: pv2c, component: cv2c },
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
