<template>
  <v-navigation-drawer
    app
    :mini-variant="!localDrawer"
    mini-variant-width="36"
    width="180"
    class="secondary"
    >
    <v-list dense>
      <v-tooltip
        v-for="(item,idx) in verticalSidebarList"
        :key="`verticalSidebarList${idx}`"
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
          title: '使用者列表',
          url: '/userList',
        },
        {
          icon: 'mdi-wrench',
          title: '修理列表',
          url: '/roomRepairList',
        },
      ],
    };
  },
  computed: {
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
    activeClass(path) {
      return this.$route.path === path ? 'v-list__tile--active' : '';
    },
  },
};
</script>
