/**
 * nvue 页面模板。
 *
 * nvue 用原生渲染，只有 flex 布局：view 默认宽高是 0，文字必须放在 text 里才能显示，
 * 所以不能复用 vue 模板。脚本用选项式写法，vue2 与 vue3 都能跑，因此不带 setup。
 */
const template = `\
<template>
  <view class="<%- options.name %>">
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
.<%- options.name %> {
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
