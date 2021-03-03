import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {router} from './router/router'
import { store } from './store';
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.use(VueCookies)
VueCookies.config('1d')
