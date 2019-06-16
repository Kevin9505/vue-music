import Vue from 'vue'
import fastclick from 'fastclick'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import store from './store'

import './common/stylus/index.styl'

// 解决移动端点击延迟 300 ms 的
fastclick.attach(document.body)
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: require('@/common/images/default.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
