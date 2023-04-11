import * as ejs from 'ejs'
import cv2 from './templates/component-vue2'
import cv3 from './templates/component-vue3'
import pv2 from './templates/page-vue2'
import pv3 from './templates/page-vue3'
import pv2c from './templates/page-composition'
import cv2c from './templates/component-composition'

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
  setup?: string
  scoped?: boolean
}

export function createViewTemplate(options: CreateViewTemplateOptions) {
  const templates = ALL_TEMPLATES[options.template || 'vue2']
  const template = templates[options.component ? 'component' : 'page']

  const handle = (attrs: (string | boolean | undefined)[]) => {
    const _v = attrs.filter(Boolean).join(' ').trim()
    return _v ? ` ${_v}` : ''
  }

  const scriptAttrs = handle([
    options.typescript && 'lang="ts"',
    options.template === 'vue3' && options.setup && 'setup',
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
