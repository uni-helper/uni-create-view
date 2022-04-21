import * as ejs from 'ejs';
import cv2 from './templates/component-vue2';
import cv3 from './templates/component-vue3';
import pv2 from './templates/page-vue2';
import pv3 from './templates/page-vue3';

const ALL_TEMPLATES = {
  v2: { page: pv2, component: cv2 },
  v3: { page: pv3, component: cv3 }
};

export interface CreateViewTemplateOptions {
  name?: string
  typescript?: boolean
  styleType?: string
  component?: boolean
  vue3?: boolean
  setup?: string
  scoped?: boolean
}

/**
 * 创建视图模版
 * @param options 
 */
export const createViewTemplate = (options: CreateViewTemplateOptions) => {
  const templates = options.vue3 ? ALL_TEMPLATES['v3'] : ALL_TEMPLATES['v2'];
  const template = templates[options.component ? 'component' : 'page'];

  const scriptAttrValue = [options.typescript && `lang="ts"`, options.vue3 && options.setup && 'setup']
    .filter(Boolean)
    .join(' ')
    .trim();
  const scriptAttrs = scriptAttrValue ? ' ' + scriptAttrValue : '';

  const styleAttrValue = [options.styleType !== 'css' && `lang="${options.styleType}"`, options.scoped && 'scoped']
    .filter(Boolean)
    .join(' ')
    .trim();
  const styleAttrs = styleAttrValue ? ' ' + styleAttrValue : '';

  const data = {
    name: options.name,
    setup: options.setup,
    typescript: options.typescript,
    scriptAttrs,
    styleAttrs,
  };
  return ejs.render(template, { options: data });
};