import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
import  '@/assets/system_htm_elements_action.js'
import  '@/assets/system_variables.js'
 //BootstrapVue
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import 'bootstrap-vue/dist/bootstrap-vue.css'
//axios
import axios from 'axios'
Vue.prototype.$axios=axios

import  '@/assets/system_functions.js'

axios.defaults.baseURL = 'http://localhost/login_2018_19_dev/Api_maraj/';
new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
