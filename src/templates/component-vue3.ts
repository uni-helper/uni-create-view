const template = `\
<template>
  <div class="<%- options.name%>"><%- options.name %></div>
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
