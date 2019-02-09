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
          :prepend-icon="item.icon" >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="subItem in item.children"
            :key="subItem.dataKey"
            @click="$router.push(subItem.path)" >
            <v-list-tile-content>
              <v-list-tile-title>{{subItem.title}}</v-list-tile-title>
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
    this.getRouterTree();
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
        url: '/v1/api/global/router/list',
        method: 'GET',
      });
      if (!res.code) {
        return res.data;
      }
      return false;
    },
    createRouterTree(rootNode, rootPath, tree, backRouterList) {
      rootNode.forEach((node) => {
        if (backRouterList.has(node.name)) {
          const { meta: { title, icon }, name: dataKey } = node;
          console.log('check', rootPath, node);
          tree.push({
            title, icon, dataKey, path: `${rootPath}${node.path}`, children: [],
          });
          if (node.children && node.children.length) {
            this.createRouterTree(
              node.children,
              `${rootPath}${node.path}/`,
              tree[tree.length - 1].children,
              backRouterList,
            );
          }
        }
      });
    },
    async getRouterTree() {
      const blackList = ['login', 'dashboard'];
      const frontRouter = this.$router.options.routes.filter(i => !blackList.includes(i.name));
      const backRouterList = new Map((await this.getRouter()).map(i => [i.dataKey, i]));
      const tree = [];
      if (backRouterList) {
        console.log('back', backRouterList);
        console.log('front', frontRouter);
        this.createRouterTree(frontRouter, '', tree, backRouterList);
        console.log('end', tree);
        this.list = tree;
      }
    },
  },
};
</script>
