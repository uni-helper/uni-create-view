/*
 * @Author: Mr.Mao
 * @Date: 2021-03-21 21:09:39
 * @LastEditTime: 2021-06-30 16:01:13
 * @Description: 
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { componentTemplate, pagesTemplate } from "./templates";

/** 创建视图函数，用于创建对应配置的视图文件内容 */
export function createV2ViewTemplate(options: CreateViewV2TemplateOptions) {
  const strike = options.viewName.replace(/([A-Z])/g, "-$1").toLocaleLowerCase();
  let templateInfo = {
    styleType: options?.styleType !== 'css' ? ` lang="${options.styleType}"` : '',
    viewName: strike.indexOf("-") === 0 ? strike.slice(1) : strike,
    importText: '',
    scriptType: '',
    templateText: options.component ? componentTemplate : pagesTemplate,
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
    templateInfo = { ...templateInfo, ...typeScriptInfo };
  }
  if (options.compositionApi) {
    templateInfo = { ...templateInfo, ...compositionApiInfo };
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
