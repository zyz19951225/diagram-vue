import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import IconFont from '../icon/iconfont'

Vue.use(ElementUI)
// Vue.use(drag)
// Vue.use(zoom)

//Vue.use(IconFont)

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
