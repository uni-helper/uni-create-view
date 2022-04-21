"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createViewTemplate = void 0;
const ejs = require("ejs");
const component_vue2_1 = require("./templates/component-vue2");
const component_vue3_1 = require("./templates/component-vue3");
const page_vue2_1 = require("./templates/page-vue2");
const page_vue3_1 = require("./templates/page-vue3");
const ALL_TEMPLATES = {
    v2: { page: page_vue2_1.default, component: component_vue2_1.default },
    v3: { page: page_vue3_1.default, component: component_vue3_1.default }
};
/**
 * 创建视图模版
 * @param options
 */
exports.createViewTemplate = (options) => {
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
//# sourceMappingURL=template.js.map