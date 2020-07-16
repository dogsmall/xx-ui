import Vue from 'vue'
import App from './App.vue'
import router from './router'

import xxUI from '@dogsmall/xx-ui'
import '@dogsmall/xx-ui/lib/styles/xx-ui.css'
Vue.use(xxUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
