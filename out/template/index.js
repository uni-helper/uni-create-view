"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createV2ViewTemplate = void 0;
/*
 * @Author: Mr.Mao
 * @Date: 2021-03-21 21:09:39
 * @LastEditTime: 2021-03-21 22:23:36
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
const templates_1 = require("./templates");
/** 创建视图函数，用于创建对应配置的视图文件内容 */
function createV2ViewTemplate(options) {
    const strike = options.viewName.replace(/([A-Z])/g, "-$1").toLocaleLowerCase();
    let templateInfo = {
        styleType: (options === null || options === void 0 ? void 0 : options.styleType) !== 'css' ? ` lang="${options.styleType}"` : '',
        viewName: strike.indexOf("-") === 0 ? strike.slice(1) : strike,
        importText: '',
        scriptType: '',
        templateText: options.component ? templates_1.componentTemplate : templates_1.pagesTemplate,
        defaultStart: '',
        defaultEnd: '',
    };
    const typeScriptInfo = {
        importText: `import Vue from 'vue';`,
        scriptType: ' lang="ts"',
        defaultStart: 'Vue.extend(',
        defaultEnd: ')'
    };
    const compositionApiInfo = {
        importText: `import { defineComponent } from '@vue/composition-api';`,
        defaultStart: 'defineComponent(',
        templateText: `setup: () => { 
    
  }`,
        defaultEnd: ')'
    };
    if (options.typescript) {
        templateInfo = Object.assign(Object.assign({}, templateInfo), typeScriptInfo);
    }
    if (options.compositionApi) {
        templateInfo = Object.assign(Object.assign({}, templateInfo), compositionApiInfo);
    }
    return `<template>
  <div class="${templateInfo.viewName}">${templateInfo.viewName}</div>
</template>

<script${templateInfo.scriptType}>
${templateInfo.importText}
export default ${templateInfo.defaultStart}{
  ${templateInfo.templateText}
}${templateInfo.defaultEnd};
</script>

<style${templateInfo.styleType}></style>
`;
}
exports.createV2ViewTemplate = createV2ViewTemplate;
//# sourceMappingURL=index.js.map