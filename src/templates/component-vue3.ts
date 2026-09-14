const template = `\
<template>
  <view class="<%- options.name%>"><%- options.name %></view>
</template>

<script<%- options.scriptAttrs %>>
<% if (options.setup) { -%>
  const props = defineProps();
<% } -%>
<% if (!options.setup) { -%>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {},
  setup: () => {}
})
<% } -%>
</script>

<style<%- options.styleAttrs %>></style>\
`
export default template
