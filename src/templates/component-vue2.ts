const content = `\
  props: {},
  data: () => ({}),
  computed: {},
  methods: {},
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {},
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {},
  // 组件周期函数--监听组件数据更新之后
  updated() {},
  // 组件周期函数--监听组件激活(显示)
  activated() {},
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() {},
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {},\
`;

const template = `\
<template>
  <div class="<%- options.name%>"><%- options.name %></div>
</template>

<script<%- options.scriptAttrs %>>
<% if (options.typescript) { %>
  <%_ \`import Vue from 'vue';\` %> 
  <%_ \`export default Vue.extend({\` %> 
<% } else { -%>
  <%_ \`export default {\` %> 
<% } -%>
${content}
<% options.typescript ? '})' : '}' %> 
</script>

<style<%- options.styleAttrs %>></style>\
`;
export default template;