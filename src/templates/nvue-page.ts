/**
 * nvue 页面模板。
 *
 * nvue 用原生渲染，只有 flex 布局：view 默认宽高是 0，文字必须放在 text 里才能显示，
 * 所以不能复用 vue 模板。脚本用选项式写法，vue2 与 vue3 都能跑，因此不带 setup。
 *
 * 根节点的样式挂在固定 class `page-root` 上，不用用户输入的名称拼选择器：
 * `2fa` 这种名字拼出来是非法选择器，整条规则会被丢掉，页面变成空白。
 */
const template = `\
<template>
  <view class="<%- options.name %> page-root">
    <text class="title"><%- options.name %></text>
  </view>
</template>

<script<%- options.scriptAttrs %>>
export default {
  data() {
    return {}
  },
}
</script>

<style<%- options.styleAttrs %>>
.page-root {
  flex: 1;
  background-color: #ffffff;
}
.title {
  margin-top: 20rpx;
  font-size: 32rpx;
  color: #333333;
}
</style>\
`
export default template
