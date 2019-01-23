import router from './router';
import { getCookie } from '@/utils/cookie';

const whiteList = ['/login']; // 不重定向白名单

router.beforeEach((to, from, next) => {
  if (getCookie('loginStatus') && getCookie('phelomi')) {
    if (to.path === whiteList[0]) {
      next({ path: '/' });
    } else {
      next();
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    next(whiteList[0]);
  }
});
