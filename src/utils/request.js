import axios from 'axios';
import { removeCookie } from './cookie';
import router from '../router';
import store from '../store';

// 创建axios实例
const service = axios.create({
  timeout: 20000, // 请求超时时间
  validateStatus: status => status >= 200 && status < 500,
});

function errorRedirect(errorMsg) {
  removeCookie('loginStatus');
  store.commit('global/setNotifySetting', {
    open: true,
    text: errorMsg,
    color: 'error',
  });
  router.push('/login');
}

let handleErrorTimeout = null;

service.interceptors.response.use(
  (response) => {
    const res = response;
    const errorMsg = {
      401: '登錄失效',
    };
    if ([401].includes(res.status)) {
      console.log('check', res.status);
      if (handleErrorTimeout) clearTimeout(handleErrorTimeout);
      handleErrorTimeout = setTimeout(() => {
        errorRedirect(errorMsg[res.status]);
        handleErrorTimeout = null;
      }, 500);
    }
    return res;
  },
  (error) => {
    const err = error;
    console.log('error', err);
    return Promise.reject(err);
  },
);

export default service;
