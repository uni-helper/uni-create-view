/**
 * nvue 组件模板。
 *
 * 同 nvue 页面模板：只有 flex 布局、文字放 text、脚本用选项式写法。
 * 组件根节点不写 flex: 1，尺寸交给使用它的父级。
 */
const template = `\
<template>
  <view class="<%- options.name %>">
    <text class="title"><%- options.name %></text>
  </view>
</template>

<script<%- options.scriptAttrs %>>
export default {
  props: {},
  data() {
    return {}
  },
}
</script>

<style<%- options.styleAttrs %>>
.<%- options.name %> {
  flex-direction: column;
}
.title {
  font-size: 28rpx;
  color: #333333;
}
</style>\
`
export default template
