import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"; // 引入 element-ui 的 css 样式
import "./assets/iconfont/iconfont.js"; // 引入iconfont

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
