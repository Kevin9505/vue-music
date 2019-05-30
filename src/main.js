import Vue from 'vue'
import fastclick from 'fastclick'
import App from './App.vue'

import '@/common/stylus/index.styl'

// 解决移动端点击延迟 300 ms 的
fastclick.attach(document.body)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
