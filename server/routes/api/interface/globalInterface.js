import {
  middlewareCheckLoginStatusSession,
} from '../../utils/session';
import { getRouter } from '../router';

export const get = [
  // 獲取有權(登入用戶)路由接口
  ['/global/router/list', middlewareCheckLoginStatusSession, getRouter],

];

export const post = [
];
