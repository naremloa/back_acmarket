import express from 'express';

import {
  middlewareValidateSession,
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../utils/session';
import {
  getCode,
  registerAccount,
  login,
  logout,
} from './login';
import {
  getOrder,
} from './order';
import {
  getRouter,
  getRouterAll,
} from './router';
import {
  getUser,
  updateUserStatus,
  updateUserRole,
} from './user';
import {
  getRoleList,
  addRole,
} from './role';
import {
  getMaintenance,
  addMaintenance,
} from './room';

const router = express.Router();

/**
 * @api {get} /login/code 驗證碼接口
 * @apiPermission none
 * @apiName GetCode
 * @apiGroup Login
 *
 * @apiSuccess {String} code 驗證碼圖片d（svg標籤）
 *
 * @apiSuccessExample Success-Response:
 *  response status 200
 *  {
 *      "code": "0",
 *      "msg": "Success",
 *      "data": {
 *        "code": "<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0,0,150,50"><path d="M14 34 C70 10,91 44,147 16" stroke="#777" fill="none"/><path ... /></svg>"
 *      }
 *  }
 */
router.get(
  '/login/code',
  getCode,
);

/**
 * @api {post} /login/register 註冊接口
 * @apiPermission none
 * @apiName register
 * @apiGroup Login
 *
 * @apiParam {String} account 帳號名稱
 * @apiParam {String} password 帳號密碼
 * @apiParam {String} code 驗證碼
 * @apiParamExample {json} Request-example:
 * {
 *    "account": "test",
 *    "password": "123qwe",
 *    "code": "12"
 * }
 *
 * @apiSuccessExample Success-Response:
 * response status 200
 * {
 *    "code": "0",
 *    "msg": "Success",
 *    "data": {}
 * }
 */
router.post(
  '/login/register',
  middlewareValidateSession,
  registerAccount,
);

// 登入接口
router.post(
  '/login/testLogin',
  middlewareValidateSession,
  login,
);

// 登出接口
router.post(
  '/login/logout',
  logout,
);

// 需要登入驗證

// 訂單接口
router.get(
  '/order/list',
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
  getOrder,
);

// 獲取有權(登入用戶)路由接口
router.get(
  '/router/list',
  middlewareCheckLoginStatusSession,
  getRouter,
);

// 獲取指定用戶所有路由接口(帶權限標示)
router.get(
  '/router/list/all',
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
  getRouterAll,
);

// 帳號接口
router.get(
  '/user/list',
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
  getUser,
);

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
 * }
 *
 */
router.post(
  '/user/review',
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
  updateUserStatus,
);

/**
 * @api {post} /user/update/role 帳號角色變更接口
 * @apiPermission login admin
 * @apiName userUpdateRole
 * @apiGroup User
 *
 * @apiParam {Number} role 角色id
 * @apiParam {String} id 帳號objectId
 * @apiParamExample {json} Request-example:
 * {
 *    "role": "1000",
 *    "id": "5c49e2ac363210458eb621dc"
 * }
 */
router.post(
  '/user/udpate/role',
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
  updateUserRole,
);

router.get(
  '/user/role/list',
  middlewareCheckLoginStatusSession,
  getRoleList,
);

router.post(
  '/user/role/add',
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
  addRole,
);

router.get(
  '/room/maintenance/list',
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
  getMaintenance,
);

router.post(
  '/room/maintenance/add',
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
  addMaintenance,
);

module.exports = router;
