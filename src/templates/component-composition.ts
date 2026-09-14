const template = `\
<template>
  <view class="<%- options.name%>"><%- options.name %></view>
</template>

<script<%- options.scriptAttrs %>>
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  props: {},
  setup: () => {}
})
</script>

<style<%- options.styleAttrs %>></style>\
`
export default template
