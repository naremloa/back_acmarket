<template>
  <v-navigation-drawer
    :value="showDrawer"
    @input="ts"
    :mini-variant="!localDrawer"
    mini-variant-width="36"
    app
    width="180"
    class="secondary"
    >
    <v-list dense>
      <div
        v-for="item in list"
        :key="item.dataKey" >
        <v-list-group
          v-model="item.active"
          :key="item.dataKey"
          no-action
          :prepend-icon="localListInfo[item.dataKey] && localListInfo[item.dataKey].icon" >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="subItem in item.childNode"
            :key="subItem.dataKey"
            @click="localListInfo[subItem.dataKey] && localListInfo[subItem.dataKey].url
              ? $router.push(localListInfo[subItem.dataKey].url)
              : null" >
            <v-list-tile-content>
              <v-list-tile-title>{{subItem.name}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import httpMethod from '@/utils/httpMethod';

export default {
  name: 'verticalSidebar',
  model: {
    prop: 'drawer',
    event: 'valueChange',
  },
  props: ['drawer'],
  data() {
    return {
      localDrawer: this.drawer,
      list: [],
      localListInfo: {
        // 帳號管理
        user: {
          icon: 'mdi-view-dashboard',
        },
        // 日常管理
        manager: {
          icon: 'mdi-wrench',
        },
        // 前台設置
        front: {
          icon: 'mdi-wrench',
        },
        // 帳號列表
        userList: {
          url: '/userList',
        },
        // 角色列表
        roleList: {
          url: '/roleList',
        },
        // 訂單列表
        orderList: {
          url: '/orderList',
        },
        // 房間列表
        roomList: {
          url: '/roomRepairList',
        },
        // 收支列表
        cashList: {
          url: '/cashList',
        },
        // 文章列表
        articleList: {
          url: '/articleList',
        },
      },
    };
  },
  computed: {
    showDrawer() {
      return this.$vuetify.breakpoint.lgAndUp || this.localDrawer;
    },
  },
  watch: {
    localDrawer(val, oldVal) {
      if (val !== oldVal) {
        this.$emit('valueChange', val);
      }
    },
    drawer(val) {
      if (val !== this.localDrawer) {
        this.localDrawer = this.drawer;
      }
    },
  },
  mounted() {
    this.getRouter();
  },
  methods: {
    ts(val) {
      if (val !== this.localDrawer) {
        this.localDrawer = val;
      }
    },
    activeClass(path) {
      return this.$route.path === path ? 'v-list__tile--active' : '';
    },
    async getRouter() {
      const res = await httpMethod({
        url: '/v1/api/router/list',
        method: 'GET',
      });
      if (!res.code) {
        this.list = res.data;
      }
    },
  },
};
</script>
