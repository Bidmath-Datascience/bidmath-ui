import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import store from './store/index'
import router from './Routes'
import VueCookies from 'vue-cookies';
import axios from "axios";
import vueNumeralFilterInstaller from "vue-numeral-filter";

Vue.use(vueNumeralFilterInstaller);
Vue.use(VueCookies);
Vue.use(axios);

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  render: h => h(App), store
}).$mount('#app')
