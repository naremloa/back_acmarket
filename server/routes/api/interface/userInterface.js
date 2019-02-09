import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  getUser,
  updateUserStatus,
  updateUserRole,
} from '../user';
import {
  getRoleList,
  addRole,
  updateRole,
} from '../role';

export const get = [
// 帳號接口
  ['/user/list',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getUser],

  ['/user/role/list',
    middlewareCheckLoginStatusSession,
    getRoleList],
];

export const post = [
  /**
 * @api {post} /user/review 審核帳號接口
 * @apiPermission login
 * @apiName userReview
 * @apiGroup User
 *
 * @apiParam {Number=1,3} status 審核狀態, 1為通過, 3為不通過
 * @apiParam {Number} role 角色id
 * @apiParam {String} id 帳號objectId
 * @apiParamExample {json} Request-example:
 * # 通過
 * {
 *    "status": "1",
 *    "role": "1000",
 *    "id": "5c49e2ac363210458eb621dc"
 * }
 *
 * # 不通過
 * {
 *    "status": 3,
 *    "id": "5c49e2ac363210458eb621dc"
 * }
 *
 */
  ['/user/review',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateUserStatus],

  /**
 * @api {post} /user/update/role 帳號角色變更接口
 * @apiPermission login admin
 * @apiName userUpdateRole
 * @apiGroup User
 *
 * @apiParam {Number} role 角色id
 * @apiParam {String} cid 帳號objectId
 * @apiParamExample {json} Request-example:
 * {
 *    "role": "1000",
 *    "cid": "5c49e2ac363210458eb621dc"
 * }
 */
  ['/user/udpate/role',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateUserRole],

  /**
 * @api {post} /user/role/add 角色添加接口
 * @apiPermission login admin
 * @apiName userRoleAdd
 * @apiGroup User
 *
 * @apiParam {String} name 角色名稱
 * @apiParam {Array} routerGroup 角色有權路由組
 */
  ['/user/role/add',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    addRole],

  ['/user/role/update',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateRole],
];
