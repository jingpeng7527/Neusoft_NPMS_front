import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins'
import store from './store'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import JsonExcel from 'vue-json-excel'

//import vue-axios
import VueAxios from 'vue-axios'




Vue.prototype.$axios = axios
Vue.prototype.$VueAxios = VueAxios
Vue.component('downloadExcel',JsonExcel)
Vue.config.productionTip = false
sync(store, router)

new Vue({
  axios,
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')
