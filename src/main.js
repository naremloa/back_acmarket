
import Vue from 'vue';
import './plugins/vuetify';
import router from './router';
import store from './store';
// import './registerServiceWorker';
import '@/permission';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/theme/index.styl';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
