import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import VForm from 'vform-builds';
import "element-ui/lib/theme-chalk/index.css"; // 引入 element-ui 的css样式
import 'vform-builds/dist/VFormDesigner.css';
import "./assets/iconfont/iconfont.js"; // 引入iconfont

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VForm);

Vue.prototype.$showLoading = function () {
  return this.$loading({
    fullscreen: true,
    text: "拼命查询中...",
    lock: true,
    background: "rgba(240, 240, 240, 0.9)",
  });
};

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
