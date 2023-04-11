const template = `\
<template>
  <div class="<%- options.name%>"><%- options.name %></div>
</template>

<script<%- options.scriptAttrs %>>
<% if (!options.setup) { -%>
import { defineComponent } from 'vue'
export default defineComponent({
  setup: () => {}
})
<% } -%>
</script>

<style<%- options.styleAttrs %>></style>\
`
export default template
