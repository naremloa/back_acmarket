import {
  middlewareCheckLoginStatusSession,
} from '../../utils/session';
import {
  getTurnip,
  editTurnip,
} from '../turnip';

export const get = [
  // 獲取有權(登入用戶)路由接口
  ['/turnip/list', middlewareCheckLoginStatusSession, getTurnip],
];

export const post = [
  ['/turnip/edit', middlewareCheckLoginStatusSession, editTurnip],
];
