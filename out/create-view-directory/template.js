"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createViewTemplate = void 0;
function createViewTemplate(options) {
    const style_type = (options === null || options === void 0 ? void 0 : options.style_type) !== 'css' ? ` lang="${options.style_type}"` : '';
    const strike = options.view_name.replace(/([A-Z])/g, "-$1").toLocaleLowerCase();
    const view_name = strike.indexOf("-") === 0 ? strike.slice(1) : strike;
    if (options.component) {
        return `<template>
  <div class="${view_name}">${view_name}</div>
</template>

<script${options.typescript ? ' lang="ts"' : ''}>
import Vue from 'vue';
export default ${options.typescript ? 'Vue.extend(' : ''}{
  props: {},
  data: () => ({}),
  methods: {},
  computed: {},
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
  beforeDestroy() {},
}${options.typescript ? ')' : ''};
</script>

<style${style_type}></style>
`;
    }
    else {
        return `<template>
  <div class="${view_name}">${view_name}</div>
</template>

<script${options.typescript ? ' lang="ts"' : ''}>
import Vue from 'vue';
export default ${options.typescript ? 'Vue.extend(' : ''}{
  components: {},
  data: () => ({}),
  methods: {},
  computed: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  onPullDownRefresh() {},
  // 页面处理函数--监听用户上拉触底
  onReachBottom() {},
  // 页面处理函数--监听页面滚动
  /* onPageScroll(event) {}, */
  // 页面处理函数--用户点击右上角分享
  /* onShareAppMessage(options) {}, */
}${options.typescript ? ')' : ''};
</script>

<style${style_type}></style>
`;
    }
}
exports.createViewTemplate = createViewTemplate;
//# sourceMappingURL=template.js.map