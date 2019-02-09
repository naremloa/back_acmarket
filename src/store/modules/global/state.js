import { getCookie } from '@/utils/cookie';

export default {
  userName: getCookie('userName') ? getCookie('userName') : '',
  notifySetting: {
    open: false,
    timeout: 6000,
    text: '',
    color: 'light-blue darken-3',
  },
  routerList: new Map(),
};
