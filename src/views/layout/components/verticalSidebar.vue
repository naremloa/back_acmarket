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
        v-for="(item,idx) in verticalSidebarList"
        :key="`verticalSidebarList${idx}`"
      >
        <v-tooltip
          v-if="item.url"
          right
          :disabled="localDrawer">
          <v-list-tile
            :class="activeClass(item.url)"
            @click="$router.push(item.url)"
            slot="activator" >
            <v-list-tile-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <span>{{item.title}}</span>
        </v-tooltip>
        <v-list-group
          v-else
          v-model="item.active"
          :key="item.title"
          :prepend-icon="item.icon"
          no-action
        >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
            v-for="subItem in item.items"
            :key="subItem.title"
              @click="subItem.url ? $router.push(subItem.url): null"
            >
              <v-list-tile-action>
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
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
      verticalSidebarList: [
        {
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
          url: '/dashboard',
        },
        {
          icon: 'mdi-file-document-outline',
          title: '訂單資訊',
          url: '/orderList',
        },
        {
          icon: 'mdi-account-box',
          title: '使用者管理',
          items: [
            {
              title: '使用者列表',
              url: '/userList',
              icon: 'mdi-book-open-variant',
            },
            {
              title: '使用者角色列表',
              url: '/roleList',
              icon: 'mdi-briefcase',
            },
            {
              title: '路由列表',
              url: '/routerList',
              icon: 'mdi-camera-control',
            },
          ],
        },
        {
          icon: 'mdi-wrench',
          title: '修理列表',
          url: '/roomRepairList',
        },
        {
          icon: 'mdi-cash',
          title: '收支列表',
          url: '/cashList',
        },
      ],
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
  },
};
</script>
