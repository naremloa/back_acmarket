import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  getRouter,
  getRouterRoleList,
  getRouterAll,
} from '../router';

export const get = [
// 獲取有權(登入用戶)路由接口
  ['/router/list', middlewareCheckLoginStatusSession, getRouter],

  /**
 * @api {get} /router/role/list 獲取指定用戶所有路由接口(帶權限標示)
 * @apiPermission login admin
 * @apiName routerRoleList
 * @apiGroup Router
 *
 * @apiParam {Number} id 角色id
 * @apiParamExample {json} Request-example:
 * {
 *    "id": 1000
 * }
 */
  ['/router/role/list',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getRouterRoleList],

  ['/router/all',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getRouterAll],
];

export const post = [
];
