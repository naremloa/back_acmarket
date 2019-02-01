import Vue from 'vue';
import Vuetify, {
  VApp,
  VNavigationDrawer,
  VFooter,
  VToolbar,
  VMenu,
  VIcon,
  VRadioGroup,
  VSnackbar,
  VCard,
  VTextField,
  VDataTable,
  VDivider,
  VDialog,
  VAlert,
  VBtn,
  VList,
  VTooltip,
} from 'vuetify/lib';
import zhHant from 'vuetify/es5/locale/zh-Hant';
import 'vuetify/src/stylus/app.styl';
import { Scroll } from 'vuetify/lib/directives';


Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VMenu,
    VIcon,
    VRadioGroup,
    VSnackbar,
    VCard,
    VTextField,
    VDataTable,
    VDivider,
    VDialog,
    VAlert,
    VBtn,
    VList,
    VTooltip,
  },
  theme: {
    primary: '#ee44aa',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
  customProperties: true,
  iconfont: 'mdi',
  lang: {
    locales: { zhHant },
    current: 'zh-Hant',
  },
  directives: {
    Scroll,
  },
  breakpoint: {
    thresholds: {
      xs: 360,
      sm: 600,
      md: 1080,
      lg: 3680,
    },
    scrollbarWidth: 10,
  },
});
