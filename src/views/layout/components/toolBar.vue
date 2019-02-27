<template>
  <v-toolbar app fixed scroll-off-screen :height="height" class="primary">
    <v-toolbar-side-icon @click.stop="localDrawer = !localDrawer"></v-toolbar-side-icon>
    <v-toolbar-title>飛樂米星空號網站後台</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-menu offset-y>
        <v-btn slot="activator" class="primary">
          Theme<v-icon>mdi-menu-down</v-icon>
        </v-btn>
        <v-list class="white theme-select__list">
          <v-radio-group v-model="selectedTheme">
            <v-radio
              v-for="(theme,idx) in themeColorsList"
              :key="`themeColors${idx}`"
              :value="theme.value"
              :class="theme.class"
            ></v-radio>
              <!-- :label="theme.label" -->
          </v-radio-group>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <v-btn slot="activator" class="primary">
          <v-icon>mdi-account</v-icon>{{userName || '用戶資訊'}}<v-icon>mdi-menu-down</v-icon>
        </v-btn>
        <v-list class="secondary">
          <v-list-tile
            v-for="(item, index) in profileMenu"
            :key="`profileMenu${index}`"
            @click="item.clickEvent"
          >
          <v-list-tile-avatar>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-avatar>
            <v-list-tile-title>
              {{item.title}}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import httpMethod from '@/utils/httpMethod';
import { removeCookie } from '@/utils/cookie';
import themeColors from '@/theme/colors';
import { mapGetters } from 'vuex';

export default {
  name: 'toolBar',
  model: {
    prop: 'drawer',
    event: 'valueChange',
  },
  props: ['drawer', 'height'],
  data() {
    return {
      localDrawer: this.drawer,
      selectedTheme: null,
      profileMenu: [
        {
          title: '修改密碼',
          clickEvent: this.methodChangePassword,
          icon: 'mdi-square-edit-outline',
        },
        {
          title: '登出',
          clickEvent: this.methodLogout,
          icon: 'mdi-logout',
        },
      ],
    };
  },
  mounted() {
    this.selectedTheme = Object.keys(themeColors)[Object.keys(themeColors).length - 2];
  },
  computed: {
    ...mapGetters({
      userName: 'global/getUserName',
    }),
    themeColorsList() {
      return Object.keys(themeColors).map(theme => ({
        label: themeColors[theme].label,
        value: theme,
        class: `theme${theme.slice(0, 1).toUpperCase() + theme.slice(1)}`,
      }));
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
    selectedTheme(val, oldVal) {
      if (val !== oldVal) {
        this.$vuetify.theme = themeColors[val].theme;
        this.$emit('changeLayoutToDark', themeColors[val].dark);
      }
    },
  },
  methods: {
    methodChangePassword() {
      console.log('​ts -> ts');
    },
    async methodLogout() {
      console.log('​logout -> logout');
      const res = await httpMethod({
        url: '/v1/api/login/logout',
        method: 'POST',
      });
      console.log('​handleLogin -> res', res);
      if (!res.code) {
        const alert = {
          open: true,
          text: res.msg === 'Success' ? '成功登出' : res.msg,
          color: 'success',
        };
        removeCookie('loginStatus');
        this.$store.commit('global/setNotifySetting', alert);
        this.$router.push('/login');
      } else {
        const alert = {
          open: true,
          text: res.msg || '登出失敗，請重新再弒，或聯絡客服人員',
          color: 'error',
        };
        this.$store.commit('global/setNotifySetting', alert);
      }
    },
  },
};
</script>
