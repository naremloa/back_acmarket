import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/layout/layout.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/pages/login/login.vue'),
    },
    {
      path: '/',
      name: '',
      component: Layout,
      redirect: 'dashboard',
      meta: {
        title: '首頁',
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/pages/dashboard/dashboard.vue'),
          meta: {
            title: '首页',
          },
        },
        {
          path: 'orderList',
          name: 'orderList',
          component: () => import('@/views/pages/orderList/orderList.vue'),
          meta: {
            title: '訂單資訊',
          },
        },
        {
          path: 'userList',
          name: 'userList',
          component: () => import('@/views/pages/userList/userList.vue'),
          meta: {
            title: '使用者列表',
          },
        },
        {
          path: 'roomRepairList',
          name: 'roomRepairList',
          component: () => import('@/views/pages/roomRepairList/roomRepairList.vue'),
          meta: {
            title: '修理列表',
          },
        },
        {
          path: 'cashList',
          name: 'cashList',
          component: () => import('@/views/pages/cashList/cashList.vue'),
          meta: {
            title: '收支明細',
          },
        },
      ],
    },
  ],
});
