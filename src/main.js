import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './common/scss/index.scss'

import './common/scss/styles.scss'

import './plugin/element'

Vue.config.productionTip = false

router.beforeEach((to, rom, next) => {
  const guiDataDoms = document.getElementsByClassName('dg main')
  guiDataDoms.forEach(dom => {
    dom && dom.parentNode.removeChild(dom)
  })
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
