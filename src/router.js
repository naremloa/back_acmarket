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
      name: 'dashboard',
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
      ],
    },
    {
      path: '/user',
      name: 'user',
      component: Layout,
      redirect: 'list',
      meta: {
        title: '帳號管理',
        icon: 'mdi-view-dashboard',
      },
      children: [
        {
          path: 'list',
          name: 'userList',
          component: () => import('@/views/pages/user/userList.vue'),
          meta: {
            title: '使用者列表',
          },
        },
        {
          path: 'role/list',
          name: 'roleList',
          component: () => import('@/views/pages/user/roleList.vue'),
          meta: {
            title: '使用者角色列表',
          },
        },
        {
          path: 'router/list',
          name: 'routerList',
          component: () => import('@/views/pages/user/routerList.vue'),
          meta: {
            title: '路由列表',
          },
        },
      ],
    },
    {
      path: '/manager',
      name: 'manager',
      component: Layout,
      redirect: 'order/list',
      meta: {
        title: '日常管理',
        icon: 'mdi-wrench',
      },
      children: [
        {
          path: 'order/list',
          name: 'orderList',
          component: () => import('@/views/pages/order/orderList.vue'),
          meta: {
            title: '訂單資訊',
          },
        },
        {
          path: 'roomRepair/list',
          name: 'roomRepairList',
          component: () => import('@/views/pages/roomRepair/roomRepairList.vue'),
          meta: {
            title: '維修列表',
          },
        },
        {
          path: 'cash/list',
          name: 'cashList',
          component: () => import('@/views/pages/cash/cashList.vue'),
          meta: {
            title: '收支明細',
          },
        },
        {
          path: 'room/list',
          name: 'room',
          component: () => import('@/views/pages/room/roomList.vue'),
          meta: {
            title: '房型設定',
          },
        },
        {
          path: 'occ/list',
          name: 'occ',
          component: () => import('@/views/pages/room/occList.vue'),
          meta: {
            title: '佔用列表',
          },
        },
      ],
    },
    {
      path: '/front',
      name: 'front',
      component: Layout,
      redirect: 'dashboard',
      meta: {
        title: '前台設置',
        icon: 'mdi-wrench',
      },
      children: [
        {
          path: 'article/list',
          name: 'articleList',
          component: () => import('@/views/pages/article/articleList.vue'),
          meta: {
            title: '文章列表',
          },
        },
        {
          path: 'article/add',
          name: 'articleAdd',
          component: () => import('@/views/pages/article/articleAdd.vue'),
          meta: {
            title: '新增文章',
            parentName: 'articleList',
          },
        },
      ],
    },
  ],
});
