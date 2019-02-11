import store from './store';
import router from './router';
import { getCookie } from '@/utils/cookie';

const whiteList = ['login', 'dashboard']; // 不重定向白名单

router.beforeEach((to, from, next) => {
  const routerMap = store.getters['global/getRouterList'];
  if (getCookie('loginStatus') && getCookie('phelomi')) {
    if (to.path === whiteList[0]) {
      next({ path: '/' });
    } else if (whiteList.includes(to.name)) {
      next();
    } else if (!routerMap.has(to.name) && !routerMap.has(to.meta && to.meta.parentName)) {
      next({ path: '/' });
    } else {
      next();
    }
  } else if (whiteList.includes(to.name)) {
    next();
  } else {
    next({ path: '/login' });
  }
});
