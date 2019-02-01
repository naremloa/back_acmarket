import Vue from 'vue';
import './plugins/vuetify';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/theme/index.styl';

import App from './App.vue';
import router from './router';
import store from './store';
// import './registerServiceWorker';
import '@/permission';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
